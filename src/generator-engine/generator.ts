import { promises as fs } from 'fs';
import path from 'path';
import OASNormalize from 'oas-normalize';
import * as Handlebars from 'handlebars';

import {
  createFolder,
  toPascalCase,
  readFile,
  writeFile,
  checkIfFileExists,
  toCamelCase,
  removeServiceSuffix,
} from './helper';

// Register Handlebars helpers
Handlebars.registerHelper('eq', function (arg1, arg2) {
  return arg1 === arg2;
});

// Interfaces
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
  'x-service-id'?: string;
}

interface PathMethod {
  operationId: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Parameter[];
  requestBody?: {
    content: {
      [mimeType: string]: {
        schema: Schema;
      };
    };
  };
  responses: {
    [statusCode: string]: {
      description?: string;
      content?: {
        [mimeType: string]: {
          schema: Schema;
        };
      };
    };
  };
}

interface Parameter {
  name: string;
  in: string;
  required?: boolean;
  schema: Schema;
}

interface Schema {
  type?: string;
  properties?: {
    [key: string]: Schema;
  };
  items?: Schema;
  required?: string[];
  $ref?: string;
}

interface GraphQLType {
  name: string;
  fields?: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
  aliasFor?: string;
}

interface GraphQLOperation {
  name: string;
  tag: string;
  responseType: string;
  inputType?: string;
  arguments: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
}

// Enums
enum GenerationType {
  Query = 'Query',
  Resolver = 'Resolver',
}

// Constants
const TEMPLATES = {
  [GenerationType.Query]: 'templates/queryTemplate.handlebars',
  [GenerationType.Resolver]: 'templates/resolverTemplate.handlebars',
};

/**
 * Generator class to convert OpenAPI specifications to GraphQL schemas and resolvers
 */
class Generator {
  private specDir: string;
  private specDirFiles: string[];

  /**
   * @param specDir Directory containing OpenAPI specification files
   */
  constructor(specDir: string) {
    this.specDir = specDir;
    this.specDirFiles = [];
  }

  /**
   * Read all YAML files in the specification directory
   */
  async readFilesInDirectory(): Promise<void> {
    try {
      const files = await fs.readdir(this.specDir);
      this.specDirFiles = files
        .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
        .map(file => path.join(this.specDir, file));
    } catch (error) {
      console.error('Error reading directory:', error);
      throw new Error(`Failed to read spec directory: ${this.specDir}`);
    }
  }

  /**
   * Parse an OpenAPI specification file and convert to OpenAPI 3.0 format
   * @param filePath Path to the specification file
   * @returns Parsed and dereferenced OpenAPI specification
   */
  async parseSpec(filePath: string): Promise<OpenAPI> {
    try {
      const oas = new OASNormalize(filePath, { enablePaths: true });
      return await oas.deref() as OpenAPI;
    } catch (error) {
      console.error(`Error parsing spec file ${filePath}:`, error);
      throw new Error(`Failed to parse specification: ${filePath}`);
    }
  }

  /**
   * Get the output folder path
   * @param relativePath Relative path from the current directory
   * @returns Absolute path to the output folder
   */
  private getOutputFolder(relativePath: string): string {
    return path.join(__dirname, relativePath);
  }

  /**
   * Extract paths from a parsed OpenAPI specification
   * @param parsedSpec Parsed OpenAPI specification
   * @returns Paths object from the specification
   */
  private getSpecPaths(parsedSpec: OpenAPI): OpenAPI['paths'] {
    return parsedSpec?.paths || {};
  }

  /**
   * Group API paths by their tags
   * @param paths Paths object from the OpenAPI specification
   * @returns Paths grouped by tags
   */
  private groupSpecPathsByTags(paths: OpenAPI['paths']): Record<string, Record<string, Record<string, PathMethod>>> {
    const groupedByTags: Record<string, Record<string, Record<string, PathMethod>>> = {};

    Object.entries(paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, details]) => {
        const pathMethod = details as PathMethod;
        if (pathMethod.tags && pathMethod.tags.length > 0) {
          pathMethod.tags.forEach((tag) => {
            if (!groupedByTags[tag]) {
              groupedByTags[tag] = {};
            }
            if (!groupedByTags[tag][path]) {
              groupedByTags[tag][path] = {};
            }
            groupedByTags[tag][path][method] = pathMethod;
          });
        }
      });
    });

    return groupedByTags;
  }

  /**
   * Get the path for GraphQL queries
   * @returns Path to GraphQL queries directory
   */
  private getQueryPath(): string {
    return '../app/graphql/queries/';
  }

  /**
   * Get the path for GraphQL resolvers
   * @returns Path to GraphQL resolvers directory
   */
  private getResolverPath(): string {
    return '../app/graphql/resolvers/';
  }

  /**
   * Get the path for service files
   * @returns Path to services directory
   */
  private getServicePath(): string {
    return '../app/services/';
  }

  /**
   * Get the output path for queries for a specific service
   * @param serviceId Service identifier
   * @returns Path to the query output directory for the service
   */
  private getQueryOutPathForServiceId(serviceId: string): string {
    return this.getOutputFolder(
      `${this.getQueryPath()}${toPascalCase(serviceId)}`
    );
  }

  /**
   * Get the output path for resolvers for a specific service
   * @param serviceId Service identifier
   * @returns Path to the resolver output directory for the service
   */
  private getResolverOutPathForServiceId(serviceId: string): string {
    return this.getOutputFolder(
      `${this.getResolverPath()}${toPascalCase(serviceId)}`
    );
  }

  /**
   * Get the output path for service files for a specific service
   * @param serviceId Service identifier
   * @returns Path to the service output directory for the service
   */
  private getServiceOutPathForServiceId(serviceId: string): string {
    return this.getOutputFolder(
      `${this.getServicePath()}${toPascalCase(serviceId)}`
    );
  }

  /**
   * Get the export name for a service
   * @param serviceId Service identifier
   * @returns Export name for the service
   */
  private getServiceExportName(serviceId: string): string {
    return `${toPascalCase(removeServiceSuffix(serviceId))}Service`;
  }

  /**
   * Get the variable name for a service
   * @param serviceId Service identifier
   * @returns Variable name for the service
   */
  private getServiceName(serviceId: string): string {
    return `${toCamelCase(removeServiceSuffix(serviceId))}Service`;
  }

  /**
   * Get the identifier for a service
   * @param serviceId Service identifier
   * @returns Service identifier without suffix
   */
  private getServiceIdentifier(serviceId: string): string {
    return removeServiceSuffix(serviceId);
  }

  /**
   * Create folder structure for a service
   * @param serviceId Service identifier
   */
  private generateGraphqlFoldersForService(serviceId: string): void {
    // Create folders for query, resolver, and service
    createFolder(this.getQueryOutPathForServiceId(serviceId));
    createFolder(this.getResolverOutPathForServiceId(serviceId));
    createFolder(this.getServiceOutPathForServiceId(serviceId));
  }

  /**
   * Get the path to the query template
   * @returns Path to the query template
   */
  private getQueryTemplate(): string {
    return path.join(__dirname, TEMPLATES[GenerationType.Query]);
  }

  /**
   * Get the path to the resolver template
   * @returns Path to the resolver template
   */
  private getResolverTemplate(): string {
    return path.join(__dirname, TEMPLATES[GenerationType.Resolver]);
  }

  /**
   * Convert OpenAPI schema to GraphQL types
   * @param schema OpenAPI schema
   * @param typeName Name for the root type
   * @returns Array of GraphQL type definitions
   */
  private convertSchemaToGraphQLTypes(schema: Schema, typeName = 'RootObject'): GraphQLType[] {
    const types: GraphQLType[] = [];
    const processedTypes = new Set<string>();

    const capitalize = (name: string): string => {
      return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const getScalarType = (type?: string): string => {
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
          return 'String'; // Default type
      }
    };

    const getType = (prop: Schema, propName = ''): string => {
      if (!prop) return 'String'; // Default type if prop is undefined

      if (prop.$ref) {
        // Handle references if present
        const refTypeName = prop.$ref.split('/').pop() || '';
        return refTypeName;
      }

      switch (prop.type) {
        case 'string':
        case 'number':
        case 'integer':
        case 'boolean':
          return getScalarType(prop.type);
        case 'array':
          return `[${processSchema(prop.items || {}, `${propName}Item`)}]`;
        case 'object':
          return processSchema(prop, propName);
        default:
          return 'String'; // Default type
      }
    };

    const processSchema = (prop: Schema, propName: string): string => {
      if (!prop) return 'String'; // Default type if prop is undefined

      if (prop.$ref) {
        // Handle references if present
        const refTypeName = prop.$ref.split('/').pop() || '';
        return refTypeName;
      }

      if (prop.type === 'object' || prop.properties) {
        const subTypeName = capitalize(propName);
        if (processedTypes.has(subTypeName)) {
          return subTypeName;
        }
        processedTypes.add(subTypeName);

        const fields: Array<{ name: string; type: string; required: boolean }> = [];
        const requiredFields = prop.required || [];

        for (const [key, value] of Object.entries(prop.properties || {})) {
          fields.push({
            name: key,
            type: getType(value, key),
            required: requiredFields.includes(key),
          });
        }

        types.push({
          name: subTypeName,
          fields,
        });

        return subTypeName;
      } else if (prop.type === 'array') {
        const itemType = getType(prop.items || {}, `${propName}Item`);
        return `[${itemType}]`;
      } else {
        return getScalarType(prop.type);
      }
    };

    // Start processing from the root schema
    const rootType = processSchema(schema, typeName);

    // If the root type is not an object, create an alias
    if (rootType !== typeName) {
      types.push({
        name: typeName,
        aliasFor: rootType,
      });
    }

    return types;
  }

  /**
   * Extract response schema from operation responses
   * @param responses Operation responses
   * @returns Response schema or null if not found
   */
  private getResponseSchema(responses: PathMethod['responses']): Schema | null {
    const successResponse = responses['200'] || responses['201'];
    if (successResponse && successResponse.content) {
      const contentType = Object.keys(successResponse.content)[0];
      return successResponse.content[contentType].schema;
    }
    return null;
  }

  /**
   * Extract request schema from operation request body
   * @param requestBody Operation request body
   * @returns Request schema or null if not found
   */
  private getRequestSchema(requestBody?: PathMethod['requestBody']): Schema | null {
    if (requestBody && requestBody.content) {
      const contentType = Object.keys(requestBody.content)[0];
      return requestBody.content[contentType].schema;
    }
    return null;
  }

  /**
   * Remove duplicate types
   * @param types Array of GraphQL types
   * @returns Array of unique GraphQL types
   */
  private deduplicateTypes(types: GraphQLType[]): GraphQLType[] {
    const typeMap: Record<string, GraphQLType> = {};
    types.forEach((type) => {
      if (!typeMap[type.name]) {
        typeMap[type.name] = type;
      }
    });
    return Object.values(typeMap);
  }

  /**
   * Map OpenAPI type to GraphQL type
   * @param type OpenAPI type
   * @returns GraphQL type
   */
  private mapOpenApiTypeToGraphQLType(type?: string): string {
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

  /**
   * Extract operation parameters
   * @param operation API operation
   * @returns Query and path parameters
   */
  private getOperationParameters(operation: PathMethod): {
    queryParams: Array<{ name: string; type: string; required: boolean }>;
    pathParams: Array<{ name: string; type: string; required: boolean }>;
  } {
    const parameters = operation.parameters || [];
    const queryParams: Array<{ name: string; type: string; required: boolean }> = [];
    const pathParams: Array<{ name: string; type: string; required: boolean }> = [];

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

  /**
   * Generate GraphQL schema and resolver files
   * @param serviceId Service identifier
   * @param groupedByTags API paths grouped by tags
   * @param template Handlebars template
   * @param generationType Type of generation (Query or Resolver)
   * @param outputPath Output path for generated files
   * @param extension File extension for generated files
   */
  private async generateSchema(
    serviceId: string,
    groupedByTags: Record<string, Record<string, Record<string, PathMethod>>>,
    template: Handlebars.TemplateDelegate,
    generationType: GenerationType,
    outputPath: string,
    extension: string
  ): Promise<void> {
    if (!template) {
      throw new Error('No valid template provided');
    }

    Object.entries(groupedByTags).forEach(([tag, paths]) => {
      const types: GraphQLType[] = [];
      const queries: GraphQLOperation[] = [];
      const mutations: GraphQLOperation[] = [];

      Object.entries(paths).forEach(([path, methods]) => {
        // Type assertion to describe the structure of methods
        const typedMethods = methods as {
          get?: PathMethod;
          post?: PathMethod;
          put?: PathMethod;
          delete?: PathMethod;
          patch?: PathMethod;
          options?: PathMethod;
          head?: PathMethod;
        };
        
        // Process GET operations (queries)
        if (typedMethods.get) {
          const operationId = typedMethods.get.operationId;
          const responseSchema = this.getResponseSchema(typedMethods.get.responses);
          
          if (responseSchema) {
            const responseTypeName = `${operationId}Response`;
            const responseTypes = this.convertSchemaToGraphQLTypes(responseSchema, responseTypeName);
            types.push(...responseTypes);

            const { queryParams, pathParams } = this.getOperationParameters(typedMethods.get);
            const args = [...pathParams, ...queryParams];

            queries.push({
              name: operationId,
              tag,
              responseType: responseTypeName,
              arguments: args,
            });
          }
        }

        // Process POST operations (mutations)
        if (typedMethods.post) {
          const operationId = typedMethods.post.operationId;
          const requestSchema = this.getRequestSchema(typedMethods.post.requestBody);
          const responseSchema = this.getResponseSchema(typedMethods.post.responses);
          
          if (requestSchema && responseSchema) {
            const requestTypeName = `${operationId}Input`;
            const responseTypeName = `${operationId}Response`;
            
            const requestTypes = this.convertSchemaToGraphQLTypes(requestSchema, requestTypeName);
            const responseTypes = this.convertSchemaToGraphQLTypes(responseSchema, responseTypeName);
            
            types.push(...requestTypes, ...responseTypes);

            const { queryParams, pathParams } = this.getOperationParameters(typedMethods.post);
            const args = [...pathParams, ...queryParams];

            mutations.push({
              name: operationId,
              tag,
              inputType: requestTypeName,
              responseType: responseTypeName,
              arguments: args,
            });
          }
        }
      });

      // Deduplicate types
      const uniqueTypes = this.deduplicateTypes(types);

      // Generate content based on generation type
      let schemaContent: string;
      if (generationType === GenerationType.Query) {
        schemaContent = template({ tag, queries, mutations, types: uniqueTypes });
      } else {
        schemaContent = template({
          ServiceName: this.getServiceExportName(serviceId),
          serviceName: this.getServiceName(serviceId),
          serviceIdentifier: this.getServiceIdentifier(serviceId),
          tag,
          queries,
          mutations,
          types: uniqueTypes
        });
      }

      // Write content to file if it differs from existing file
      const filename = path.join(outputPath, `${tag}_${extension}`);
      if (!checkIfFileExists(filename) || readFile(filename) !== schemaContent) {
        writeFile(filename, schemaContent);
        console.log(`Generated or updated schema file: ${filename}`);
      } else {
        console.log(`No changes detected for ${filename}, skipping update.`);
      }
    });
  }

  /**
   * Generate GraphQL schema and resolver files for all OpenAPI specifications
   */
  async generateSchemaAndResolver(): Promise<void> {
    if (this.specDirFiles.length === 0) {
      await this.readFilesInDirectory();
    }

    for (const file of this.specDirFiles) {
      try {
        const parsedSpec = await this.parseSpec(file);

        const serviceId = parsedSpec['x-service-id'];
        if (!serviceId) {
          throw new Error(`Missing service ID (x-service-id) in spec file: ${file}`);
        }

        // Create folder structure
        this.generateGraphqlFoldersForService(serviceId);

        // Compile templates
        const queryTemplateSource = readFile(this.getQueryTemplate());
        const queryTemplate = Handlebars.compile(queryTemplateSource);

        const resolverTemplateSource = readFile(this.getResolverTemplate());
        const resolverTemplate = Handlebars.compile(resolverTemplateSource);

        // Group paths by tags
        const specPaths = this.getSpecPaths(parsedSpec);
        const groupedPaths = this.groupSpecPathsByTags(specPaths);

        // Generate query schema
        await this.generateSchema(
          serviceId,
          groupedPaths,
          queryTemplate,
          GenerationType.Query,
          this.getQueryOutPathForServiceId(serviceId),
          'schema.ts'
        );

        // Generate resolver
        await this.generateSchema(
          serviceId,
          groupedPaths,
          resolverTemplate,
          GenerationType.Resolver,
          this.getResolverOutPathForServiceId(serviceId),
          'resolver.ts'
        );

        console.log(`Successfully processed spec file: ${file}`);
      } catch (error) {
        console.error(`Error processing spec file ${file}:`, 
          error instanceof Error ? error.message : String(error));
      }
    }
  }
}

export default Generator;