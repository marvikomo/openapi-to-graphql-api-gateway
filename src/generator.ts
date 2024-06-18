const fs = require('fs').promises
import path from 'path'
import OASNormalize from 'oas-normalize'
import { loadYaml, convertToOas3 } from './oas'
import * as Handlebars from 'handlebars'

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
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  paths: {
    [key: string]: {
      [method: string]: PathMethod;
    };
  };
}


interface PathMethod {
  operationId: string;
  requestBody?: {
    content: {
      [mimeType: string]: {
        schema: Schema;
      };
    };
  };
}

interface Schema {
  type?: string;
  properties?: {
    [key: string]: Schema;
  };
  items?: Schema;
}

interface Operation {
  operationId: string;
  params: string[];
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

      console.log("xxx", this.specDirFiles)
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

    if (!template) {
      throw new Error('No valid template')
    }

    Object.entries(groupedByTags).forEach(([tag, paths]) => {
      // console.log("path", methods)
      Object.entries(paths).forEach(([path, methods]) => {
        console.log(
          'method2',
          methods,
        )
        console.log(
          'method2',
          this.extractRequestBodyParams(methods.post?.requestBody),
        )
        if (methods.get) {
          queries.push({ name: methods.get.operationId, tag })
        }

        if (methods.post) {
          mutations.push({ name: methods.post.operationId, tag })
        }
      })

      let schemaContent

      if (GenerationType.Query == generationType) {
        schemaContent = template({ tag, queries, mutations })
      }

      if (GenerationType.Resolver == generationType) {
        schemaContent = template({
          ServiceName: this.getServiceExportName(serviceId),
          serviceName: this.getServiceName(serviceId),
          serviceIdentifier: this.getServiceIdentifier(serviceId),
          tag,
          queries,
          mutations,
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

   extractRequestBodyParams(requestBody: { content: { [mimeType: string]: { schema: Schema } } }): string[] {
    const params: string[] = [];
    const content = requestBody?.content || {};
  
    for (const [mimeType, mediaTypeObject] of Object.entries(content)) {
      const schema = mediaTypeObject.schema || {};
      this.extractParamsFromSchema(schema, params);
    }
  
    return params;
  }

   extractParamsFromSchema(schema: Schema, params: string[], parentKey: string = ''): void {
    const properties = schema.properties || {};
    
    for (const [param, details] of Object.entries(properties)) {
      const fullParamName = parentKey ? `${parentKey}.${param}` : param;
  
      if (details.type === 'object' && details.properties) {
        this.extractParamsFromSchema(details, params, fullParamName);
      } else if (details.type === 'array' && details.items) {
        if (details.items.type === 'object' && details.items.properties) {
          this.extractParamsFromSchema(details.items, params, `${fullParamName}[]`);
        } else {
          params.push(`${fullParamName}[]`);
        }
      } else {
        params.push(fullParamName);
      }
    }
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

      const resolverTemplateSource =  readFile(this.getResolverTemplate())
      const resolverTemp = Handlebars.compile(resolverTemplateSource)
      
    

      this.generateSchema(
        serviceId,
        this.groupSpecPathsByTags(this.getSpecPaths(parsedSpec)),
        template,
        GenerationType.Query,
        this.getQueryOutPathForServiceId(serviceId),
        'schema.ts'
      )

      this.generateSchema(serviceId, this.groupSpecPathsByTags(this.getSpecPaths(parsedSpec)), resolverTemp,  GenerationType.Resolver,  this.getResolverOutPathForServiceId(serviceId), 'resolver.ts')
    }
  }
}

export default Generator

//For Service let it be Pascal Case
