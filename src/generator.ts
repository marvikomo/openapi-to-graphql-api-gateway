const fs = require('fs').promises
import path from 'path'
import OASNormalize from 'oas-normalize'
import { loadYaml, convertToOas3 } from './oas'
import * as Handlebars from 'handlebars'
import CircularJSON from 'circular-json'

Handlebars.registerHelper('eq', function (arg1, arg2) {
  return arg1 === arg2;
});

import {
  createFolder,
  toPascalCase,
  readFile,
  writeFile,
  checkIfFileExists,
  toCamelCase,
  removeServiceSuffix,
} from './helper'

interface OpenAPI {
  openapi: string
  info: {
    title: string
    version: string
  }
  paths: {
    [key: string]: {
      [method: string]: PathMethod
    }
  }
}

interface PathMethod {
  operationId: string
  requestBody?: {
    content: {
      [mimeType: string]: {
        schema: Schema
      }
    }
  }
}

interface Schema {
  type?: string
  properties?: {
    [key: string]: Schema
  }
  items?: Schema
  required?: string[]
}

interface Operation {
  operationId: string
  params: string[]
}

const Modules = {}
enum GenerationType {
  Query,
  Resolver,
}

const Templates = {
  Query: 'templates/queryTemplate.handlebars',
  Resolver: 'templates/resolverTemplate.handlebars',
}

class Generator {
  specDir: string
  specDirFiles: any[]

  constructor(specDir: string) {
    this.specDir = specDir
    this.specDirFiles = []
  }

  async readFilesInDirectory(): Promise<any> {
    try {
      const files = await fs.readdir(this.specDir)
      for (const file of files) {
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
          const filepath = path.join(this.specDir, file)
          this.specDirFiles.push(filepath)
        }
      }

      console.log('xxx', this.specDirFiles)
    } catch (error) {
      console.error('Error reading directory:', error)
    }
  }

  async parseSpec(path): Promise<any> {
    const parsedSpec = loadYaml(path)
    const convertedSpec = await convertToOas3(parsedSpec)
    const oas = new OASNormalize(path, { enablePaths: true })
    return oas.deref()
  }

  getOutputFolder = (_path) => {
    return path.join(__dirname, _path)
  }

  getSpecPaths = (parsedSpec) => {
    return parsedSpec?.paths
  }

  groupSpecPathsByTags = (paths) => {
    const groupedByTags = []
    Object.entries(paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, details]) => {
        if (details.tags) {
          details.tags.forEach((tag) => {
            if (!groupedByTags[tag]) {
              groupedByTags[tag] = {}
            }
            if (!groupedByTags[tag][path]) {
              groupedByTags[tag][path] = {}
            }
            groupedByTags[tag][path][method] = details
          })
        }
      })
    })

    return groupedByTags
  }

  async generateQuery() {}

  getQueryPath() {
    return '../app/graphql/queries/'
  }

  getResolverPath() {
    return '../app/graphql/resolvers/'
  }

  getServicePath() {
    return '../app/services/'
  }

  getQueryOutPathForServiceId(serviceId) {
    return this.getOutputFolder(
      `${this.getQueryPath()}${toPascalCase(serviceId)}`,
    )
  }

  getResolverOutPathForServiceId(serviceId) {
    return this.getOutputFolder(
      `${this.getResolverPath()}${toPascalCase(serviceId)}`,
    )
  }

  getServiceOutPathForServiceId(serviceId) {
    return this.getOutputFolder(
      `${this.getServicePath()}${toPascalCase(serviceId)}`,
    )
  }

  getServiceExportName(serviceId) {
    return `${toPascalCase(removeServiceSuffix(serviceId))}Service`
  }

  getServiceName(serviceId) {
    return `${toCamelCase(removeServiceSuffix(serviceId))}Service`
  }

  getServiceIdentifier(serviceId) {
    return removeServiceSuffix(serviceId)
  }

  generateGraphqlFoldersForService(serviceId) {
    //Creates for query
    createFolder(this.getQueryOutPathForServiceId(serviceId))

    //Create for resolver
    createFolder(this.getResolverOutPathForServiceId(serviceId))

    //Create for Service
    createFolder(this.getServiceOutPathForServiceId(serviceId))
  }

  getQueryTemplate() {
    return path.join(__dirname, Templates.Query)
  }

  getResolverTemplate() {
    return path.join(__dirname, Templates.Resolver)
  }

  convertSchemaToGraphQLTypes(schema, typeName = 'RootObject') {
    const types = []
    const processedTypes = new Set()

    function processSchema(prop, propName) {
      if (!prop) return 'String' // Default type if prop is undefined

      if (prop.$ref) {
        // Handle references if present
        const refTypeName = prop.$ref.split('/').pop()
        return refTypeName
      }

      if (prop.type === 'object' || prop.properties) {
        const subTypeName = capitalize(propName)
        if (processedTypes.has(subTypeName)) {
          return subTypeName
        }
        processedTypes.add(subTypeName)

        const fields = []
        const requiredFields = prop.required || []

        for (const [key, value] of Object.entries(prop.properties || {})) {
          fields.push({
            name: key,
            type: getType(value, key),
            required: requiredFields.includes(key),
          })
        }

        types.push({
          name: subTypeName,
          fields,
        })

        return subTypeName
      } else if (prop.type === 'array') {
        const itemType = getType(prop.items, propName + 'Item')
        return `[${itemType}]`
      } else {
        return getScalarType(prop.type)
      }
    }

    function getType(prop, propName = '') {
      if (prop.$ref) {
        // Handle references if present
        const refTypeName = prop.$ref.split('/').pop()
        return refTypeName
      }

      switch (prop.type) {
        case 'string':
          return 'String'
        case 'number':
          return 'Float'
        case 'integer':
          return 'Int'
        case 'boolean':
          return 'Boolean'
        case 'array':
          return processSchema(prop, propName)
        case 'object':
          return processSchema(prop, propName)
        default:
          return 'String' // Default type
      }
    }

    function getScalarType(type) {
      switch (type) {
        case 'string':
          return 'String'
        case 'number':
          return 'Float'
        case 'integer':
          return 'Int'
        case 'boolean':
          return 'Boolean'
        default:
          return 'String'
      }
    }

    function capitalize(name) {
      return name.charAt(0).toUpperCase() + name.slice(1)
    }

    // Start processing from the root schema
    const rootType = processSchema(schema, typeName)

    // If the root type is not an object, create an alias
    if (rootType !== typeName) {
      types.push({
        name: typeName,
        aliasFor: rootType,
      })
    }

    return types
  }

  getResponseSchema(responses) {
    const successResponse = responses['200'] || responses['201']
    if (successResponse && successResponse.content) {
      const contentType = Object.keys(successResponse.content)[0]
      return successResponse.content[contentType].schema
    }
    return null
  }

 getRequestSchema(requestBody) {
    if (requestBody && requestBody.content) {
      const contentType = Object.keys(requestBody.content)[0];
      return requestBody.content[contentType].schema;
    }
    return null;
  }

  deduplicateTypes(types) {
    const typeMap = {}
    types.forEach((type) => {
      if (!typeMap[type.name]) {
        typeMap[type.name] = type
      }
    })
    return Object.values(typeMap)
  }

  mapOpenApiTypeToGraphQLType(type) {
    switch (type) {
      case 'string':
        return 'String';
      case 'number':
        return 'Float';
      case 'integer':
        return 'Int';
      case 'boolean':
        return 'Boolean';
      default:
        return 'String';
    }
  }

 getOperationParameters(operation) {
    const parameters = operation.parameters || [];
    const queryParams = [];
    const pathParams = [];
  
    parameters.forEach((param) => {
      const paramInfo = {
        name: param.name,
        type: this.mapOpenApiTypeToGraphQLType(param.schema.type),
        required: param.required || false,
      };
  
      if (param.in === 'query') {
        queryParams.push(paramInfo);
      } else if (param.in === 'path') {
        pathParams.push(paramInfo);
      }
    });
  
    return { queryParams, pathParams };
  }

  
  

  async generateSchema(
    serviceId,
    groupedByTags,
    template,
    generationType,
    outputPath,
    extension,
  ) {
    let queries = []
    let mutations = []

    const types = []
    const processedTypes = new Set()

    if (!template) {
      throw new Error('No valid template')
    }

    Object.entries(groupedByTags).forEach(([tag, paths]) => {
      // console.log("path", methods)
      Object.entries(paths).forEach(([path, methods]) => {
        // console.log(
        //   'method2',
        //   this.extractRequestBodyParams(methods.post?.requestBody),
        // )
        if (methods.get) {
          const operationId = methods.get.operationId
          const responseSchema = this.getResponseSchema(methods.get.responses)

          console.log('response', operationId)
          console.dir(responseSchema, { depth: null, colors: true })
          const responseTypeName = operationId + 'Response'

          const responseTypes = this.convertSchemaToGraphQLTypes(
            responseSchema,
            responseTypeName,
          )
          types.push(...responseTypes)
          console.log('response types')
          console.dir(responseTypes, { depth: null, colors: true })


          const { queryParams, pathParams } = this.getOperationParameters(methods.get);
          const args = [...pathParams, ...queryParams];



          queries.push({
            name: methods.get.operationId,
            tag,
            responseType: responseTypeName,
            arguments: args,
          })
        }

        if (methods.post) {
          const operationId = methods.post.operationId
          const requestSchema = this.getRequestSchema(methods.post.requestBody);
          const requestTypeName = operationId + 'Input';
          const requestTypes = this.convertSchemaToGraphQLTypes(requestSchema, requestTypeName);

          const responseSchema = this.getResponseSchema(methods.post.responses);
          const responseTypeName = operationId + 'Response';
          const responseTypes = this.convertSchemaToGraphQLTypes(responseSchema, responseTypeName);

          types.push(...requestTypes, ...responseTypes)

          mutations.push({
            name: methods.post.operationId,
            tag,
            inputType: requestTypeName,
            responseType: responseTypeName,
          })
        }
      })

      // Deduplicate types
      const uniqueTypes = this.deduplicateTypes(types)

      let schemaContent

      if (GenerationType.Query == generationType) {
        schemaContent = template({ tag, queries, mutations , types: uniqueTypes})
      }

      if (GenerationType.Resolver == generationType) {
        schemaContent = template({
          ServiceName: this.getServiceExportName(serviceId),
          serviceName: this.getServiceName(serviceId),
          serviceIdentifier: this.getServiceIdentifier(serviceId),
          tag,
          queries,
          mutations,
          types: uniqueTypes
        })
      }

      const filename = path.join(outputPath, `${tag}_${extension}`)
      console.log('fileName', filename)
      if (
        !checkIfFileExists(filename) ||
        readFile(filename) !== schemaContent
      ) {
        writeFile(filename, schemaContent)
        console.log(`Generated or updated schema file: ${filename}`)
      } else {
        console.log(`No changes detected for ${filename}, skipping update.`)
      }
      queries = []
      mutations = []
    })
  }

  generateArgsString = (args) => {
    return args.map((arg) => `${arg.name}: ${arg.type}`).join(', ')
  }

  parseType(property: any, seenSchemas: Set<string> = new Set()): string {
    if (property.$ref) {
      const refType = property.$ref.split('/').pop()
      if (seenSchemas.has(refType!)) {
        return refType!
      }
      seenSchemas.add(refType!)
      return refType!
    }

    if (property.type === 'array' && property.items) {
      return `${this.parseType(property.items, seenSchemas)}[]`
    } else if (property.type === 'object' && property.properties) {
      return `{ ${Object.entries(property.properties)
        .map(([key, value]) => `${key}: ${this.parseType(value, seenSchemas)}`)
        .join('; ')} }`
    }
    return property.type
  }

  async generateSchemaAndResolver(): Promise<void> {
    for (const file of this.specDirFiles) {
      const parsedSpec = await this.parseSpec(file)

      //console.log('parsed spec', parsedSpec)

      const serviceId = parsedSpec['x-service-id']
      if (!serviceId)
        throw new Error('Missing serviceId in this format x-service-id')

      this.generateGraphqlFoldersForService(serviceId)

      const templateSource = readFile(this.getQueryTemplate())
      const template = Handlebars.compile(templateSource)

      const resolverTemplateSource = readFile(this.getResolverTemplate())
      const resolverTemp = Handlebars.compile(resolverTemplateSource)

      this.generateSchema(
        serviceId,
        this.groupSpecPathsByTags(this.getSpecPaths(parsedSpec)),
        template,
        GenerationType.Query,
        this.getQueryOutPathForServiceId(serviceId),
        'schema.ts',
      )

      this.generateSchema(
        serviceId,
        this.groupSpecPathsByTags(this.getSpecPaths(parsedSpec)),
        resolverTemp,
        GenerationType.Resolver,
        this.getResolverOutPathForServiceId(serviceId),
        'resolver.ts',
      )
    }
  }
}

export default Generator

//For Service let it be Pascal Case
