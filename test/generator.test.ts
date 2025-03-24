import Generator from "../src/generator-engine/generator";
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import * as path from 'path';
import OASNormalize from 'oas-normalize';
import {
  createFolder,
  readFile,
  writeFile,
  checkIfFileExists,
  toPascalCase,
  toCamelCase,
  removeServiceSuffix,
} from '../src/generator-engine/helper';
import * as Handlebars from 'handlebars';

jest.mock('fs/promises');
jest.mock('../src/generator-engine/helper');
jest.mock('handlebars');
jest.mock('oas-normalize');
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
  },
}));
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
}));

describe('Generator Class Tests', () => {
  let generator: Generator;

  beforeEach(() => {
    generator = new Generator('/mock/dir/specDir');
    // Reset any mocks whose state might carry over between tests
    jest.clearAllMocks();
  });

  test('Placeholder test', () => {
    expect(true).toBe(true);
  });

  describe('readFilesInDirectory', () => {
    it('should populate specDirFiles with YAML files', async () => {
      (fsPromises.readdir as jest.Mock).mockResolvedValue(['file1.yaml', 'file2.yml', 'file3.json']);
      (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

      await generator.readFilesInDirectory();

      // Access the private property using type assertion 
      expect((generator as any).specDirFiles).toEqual([
        '/mock/dir/specDir/file1.yaml',
        '/mock/dir/specDir/file2.yml',
      ]);
    });

    it('should handle errors when reading directory', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (fsPromises.readdir as jest.Mock).mockRejectedValue(new Error('Read directory error'));
    
      // The method should now throw an error
      await expect(generator.readFilesInDirectory()).rejects.toThrow('Failed to read spec directory');
    
      // Check that the error was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reading directory:',
        expect.any(Error)
      );
    
      consoleSpy.mockRestore(); // Restore original console.error behavior
    });
  });

  describe('parseSpec', () => {
    it('should parse and dereference OpenAPI spec', async () => {
      const mockSpec = { openapi: '3.0.0' };
      const mockOas = {
        deref: jest.fn().mockResolvedValue(mockSpec),
      };
  
      // Mock the OASNormalize constructor to return our mockOas object
      (OASNormalize as jest.MockedClass<typeof OASNormalize>).mockImplementation(() => mockOas as any);
  
      const result = await generator.parseSpec('mock/file/path');
  
      expect(result).toEqual(mockSpec);
      expect(OASNormalize).toHaveBeenCalledWith('mock/file/path', { enablePaths: true });
      expect(mockOas.deref).toHaveBeenCalled();
    });

    it('should handle errors when parsing spec', async () => {
      const mockOas = {
        deref: jest.fn().mockRejectedValue(new Error('Parsing error')),
      };
  
      (OASNormalize as jest.MockedClass<typeof OASNormalize>).mockImplementation(() => mockOas as any);
  
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      await expect(generator.parseSpec('mock/file/path')).rejects.toThrow('Failed to parse specification');
  
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('groupSpecPathsByTags', () => {
    it('should return empty object when no tags are present', () => {
      const paths = {
        '/path1': {
          get: {
            summary: 'This is get ops',
            description: 'test test',
            'x-visibility': 'public',
            operationId: 'operation1',
            responses: {}
          },
        },
        '/path2': {
          post: { 
            summary: 'This is post ops',
            description: 'test test',
            'x-visibility': 'public',
            operationId: 'operation2',
            responses: {}
          },
        },
      };

      // Access the private method using type assertion
      const grouped = (generator as any).groupSpecPathsByTags(paths);
      expect(grouped).toEqual({});
    });

    it('should return empty object when tag arrays are empty', () => {
      const paths = {
        '/path1': {
          get: {
            summary: 'This is get ops',
            description: 'test test',
            'x-visibility': 'public',
            operationId: 'operation1',
            tags: [],
            responses: {}
          },
        },
        '/path2': {
          post: { 
            summary: 'This is post ops',
            description: 'test test',
            'x-visibility': 'public',
            operationId: 'operation2',
            tags: [],
            responses: {}
          },
        },
      };

      // Access the private method using type assertion
      const grouped = (generator as any).groupSpecPathsByTags(paths);
      expect(grouped).toEqual({});
    });

    it('should group paths by tags', () => {
      const paths = {
        '/path1': {
          get: {
            summary: 'This is get ops',
            description: 'test test',
            'x-visibility': 'public',
            operationId: 'operation1',
            tags: ['tag1'],
            responses: {}
          },
        },
        '/path2': {
          post: { 
            summary: 'This is post ops',
            description: 'test test',
            'x-visibility': 'public',
            operationId: 'operation2',
            tags: ['tag2'],
            responses: {}
          },
        },
      };

      // Access the private method using type assertion
      const grouped = (generator as any).groupSpecPathsByTags(paths);

      expect(grouped).toEqual({
        tag1: {
          '/path1': {
            get: { 
              summary: 'This is get ops',
              description: 'test test',
              'x-visibility': 'public',
              operationId: 'operation1',
              tags: ['tag1'],
              responses: {}
            },
          },
        },
        tag2: {
          '/path2': {
            post: { 
              summary: 'This is post ops',
              description: 'test test',
              'x-visibility': 'public',
              operationId: 'operation2',
              tags: ['tag2'],
              responses: {}
            },
          },
        },
      });
    });
  });

  describe('generateGraphqlFoldersForService', () => {
    it('should create required folders', () => {
      (toPascalCase as jest.Mock).mockReturnValue('MockService');

      // Access the private method using type assertion
      (generator as any).generateGraphqlFoldersForService('mockService');

      expect(createFolder).toHaveBeenCalledWith(
        expect.stringContaining('/queries/MockService')
      );
      expect(createFolder).toHaveBeenCalledWith(
        expect.stringContaining('/resolvers/MockService')
      );
      expect(createFolder).toHaveBeenCalledWith(
        expect.stringContaining('/services/MockService')
      );
    });
  });

  describe('convertSchemaToGraphQLTypes', () => {
    it('should convert OpenAPI schema to GraphQL types', () => {
      const schema = {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
        },
        required: ['id'],
      };

      // Access the private method using type assertion
      const types = (generator as any).convertSchemaToGraphQLTypes(schema);

      expect(types).toEqual([
        {
          name: 'RootObject',
          fields: [
            { name: 'id', type: 'Int', required: true },
            { name: 'name', type: 'String', required: false },
          ],
        },
      ]);
    });
    
    it('should convert scalar properties to GraphQL scalar types', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'integer' },
          price: { type: 'number', format: 'float' },
          isActive: { type: 'boolean' },
        },
      };
    
      // Access the private method using type assertion
      const graphqlTypes = (generator as any).convertSchemaToGraphQLTypes(schema, 'RootObject');
    
      expect(graphqlTypes).toEqual([
        {
          name: 'RootObject',
          fields: [
            { name: 'name', type: 'String', required: false },
            { name: 'age', type: 'Int', required: false },
            { name: 'price', type: 'Float', required: false },
            { name: 'isActive', type: 'Boolean', required: false },
          ],
        },
      ]);
    });

    it('should convert nested objects into separate GraphQL types', () => {
      const schema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
      };
    
      // Access the private method using type assertion
      const result = (generator as any).convertSchemaToGraphQLTypes(schema, 'RootObject');
    
      expect(result).toEqual([
        {
          name: 'User',
          fields: [
            { name: 'username', type: 'String', required: false },
            { name: 'email', type: 'String', required: false }
          ]
        },
        {
          name: 'RootObject',
          fields: [ { name: 'user', type: 'User', required: false } ]
        }
      ]);
    });

    it('should convert arrays of scalar fields to GraphQL list types', () => {
      const schema = {
        type: 'object',
        properties: {
          tags: { type: 'array', items: { type: 'string' } },
          scores: { type: 'array', items: { type: 'integer' } },
        },
      };
    
      // Access the private method using type assertion
      const result = (generator as any).convertSchemaToGraphQLTypes(schema, 'RootObject');
    
      expect(result).toEqual([
        {
          name: 'RootObject',
          fields: [
            { name: 'tags', type: '[String]', required: false },
            { name: 'scores', type: '[Int]', required: false },
          ],
        },
      ]);
    });

    it('should convert arrays of objects into separate GraphQL types', () => {
      const schema = {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                price: { type: 'number' },
              },
            },
          },
        },
      };
    
      // Access the private method using type assertion
      const result = (generator as any).convertSchemaToGraphQLTypes(schema, 'RootObject');
     
      expect(result).toEqual([
        {
          name: 'ProductsItem',
          fields: [
            { name: 'productId', type: 'String', required: false },
            { name: 'price', type: 'Float', required: false }
          ]
        },
        {
          name: 'RootObject',
          fields: [ { name: 'products', type: '[ProductsItem]', required: false } ]
        }
      ]);
    });

    it('should handle recursive objects with self-referencing types', () => {
      const schema = {
        type: 'object',
        properties: {
          category: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              children: {
                type: 'array',
                items: { $ref: '#/components/schemas/Category' },
              },
            },
          },
        },
      };
    
      // Access the private method using type assertion
      const result = (generator as any).convertSchemaToGraphQLTypes(schema, 'RootObject');
    
      expect(result).toEqual([
        {
          name: 'Category',
          fields: [
            { name: 'id', type: 'Int', required: false },
            { name: 'children', type: '[Category]', required: false }
          ]
        },
        {
          name: 'RootObject',
          fields: [ { name: 'category', type: 'Category', required: false } ]
        }
      ]);
    });

    it('should convert top-level arrays into an alias GraphQL type', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
      };
    
      // Access the private method using type assertion
      const result = (generator as any).convertSchemaToGraphQLTypes(schema, 'RootObject');
    
      expect(result).toEqual([
        {
          name: 'RootObjectItem',
          fields: [
            { name: 'id', type: 'String', required: false },
            { name: 'name', type: 'String', required: false },
          ],
        },
        { name: 'RootObject', aliasFor: '[RootObjectItem]' },
      ]);
    });

    it('should handle complex schemas with nested objects, arrays, and recursion', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            product: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                category: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    children: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
                  },
                },
              },
            },
          },
        },
      };
    
      // Access the private method using type assertion
      const result = (generator as any).convertSchemaToGraphQLTypes(schema, 'RootObject');
    
      expect(result).toEqual([
        {
          name: 'Category',
          fields: [
            { name: 'id', type: 'Int', required: false },
            { name: 'children', type: '[Category]', required: false }
          ]
        },
        {
          name: 'Product',
          fields: [
            { name: 'productId', type: 'String', required: false },
            { name: 'category', type: 'Category', required: false }
          ]
        },
        {
          name: 'RootObjectItem',
          fields: [
            { name: 'id', type: 'String', required: false },
            { name: 'product', type: 'Product', required: false }
          ]
        },
        { name: 'RootObject', aliasFor: '[RootObjectItem]' }
      ]);
    });
  });

  describe('UUID handling', () => {
    it('should handle arrays of UUIDs correctly', () => {
      const schema = {
        type: 'object',
        properties: {
          userIds: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid',
              example: '3a5aaea8-504a-4404-ad3d-b82574fba5e5',
            },
          },
        },
      };
    
      // Access the private method using type assertion
      const result = (generator as any).convertSchemaToGraphQLTypes(schema, 'RootObject');
    
      expect(result).toEqual([
        {
          name: 'RootObject',
          fields: [
            {
              name: 'userIds',
              type: '[String]', // Array of UUIDs map to "[String]"
              required: false,
            },
          ],
        },
      ]);
    });

    it('should handle UUIDs in nested objects correctly', () => {
      const schema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
              },
              profileId: {
                type: 'string',
                format: 'uuid',
              },
            },
          },
        },
      };
    
      // Access the private method using type assertion
      const result = (generator as any).convertSchemaToGraphQLTypes(schema, 'RootObject');
    
      expect(result).toEqual([
        {
          name: 'User',
          fields: [
            { name: 'id', type: 'String', required: false },
            { name: 'profileId', type: 'String', required: false },
          ],
        },
        {
          name: 'RootObject',
          fields: [{ name: 'user', type: 'User', required: false }],
        },
      ]);
    });
  });

  describe('generateSchemaAndResolver', () => {
    it('should process all spec files and generate schemas and resolvers', async () => {
      // Setup mocks
      const mockSpec = {
        'x-service-id': 'mockService',
        paths: {
          '/path1': {
            get: {
              operationId: 'getOperation',
              tags: ['tag1'],
              responses: {
                '200': {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      // Mock specDirFiles and parseSpec
      (generator as any).specDirFiles = ['file1.yaml'];
      (generator as any).parseSpec = jest.fn().mockResolvedValue(mockSpec);
      
      // Mock template compilation
      const mockTemplate = jest.fn().mockReturnValue('template content');
      (Handlebars.compile as jest.Mock).mockReturnValue(mockTemplate);
      
      // Mock file operations
      (readFile as jest.Mock).mockReturnValue('template source');
      (checkIfFileExists as jest.Mock).mockReturnValue(false);
      
      await generator.generateSchemaAndResolver();
      
      // Verify folder creation
      expect(createFolder).toHaveBeenCalledTimes(3); // For query, resolver, and service folders
      
      // Verify template compilation
      expect(Handlebars.compile).toHaveBeenCalledTimes(2); // For query and resolver templates
      
      // Verify file writing
      expect(writeFile).toHaveBeenCalledTimes(2); // For query and resolver files
    });

    it('should handle errors in processing spec files', async () => {
      // Setup mock for error case
      (generator as any).specDirFiles = ['file1.yaml'];
      (generator as any).parseSpec = jest.fn().mockRejectedValue(new Error('Spec parsing error'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // This should not throw error but log it
      await generator.generateSchemaAndResolver();
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should skip generating files if no changes detected', async () => {
      // Setup mocks
      const mockSpec = {
        'x-service-id': 'mockService',
        paths: {
          '/path1': {
            get: {
              operationId: 'getOperation',
              tags: ['tag1'],
              responses: {
                '200': {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      // Mock specDirFiles and parseSpec
      (generator as any).specDirFiles = ['file1.yaml'];
      (generator as any).parseSpec = jest.fn().mockResolvedValue(mockSpec);
      
      // Mock template compilation
      const mockTemplate = jest.fn().mockReturnValue('template content');
      (Handlebars.compile as jest.Mock).mockReturnValue(mockTemplate);
      
      // Mock file operations to indicate file exists and content is the same
      (readFile as jest.Mock).mockImplementation((path) => {
        if (path.includes('Template')) return 'template source';
        return 'template content'; // Return same content for file read check
      });
      (checkIfFileExists as jest.Mock).mockReturnValue(true);
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      await generator.generateSchemaAndResolver();
      
      // Verify no file was written
      expect(writeFile).not.toHaveBeenCalled();
      
      // Verify log message
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No changes detected'));
      
      consoleSpy.mockRestore();
    });
  });
});