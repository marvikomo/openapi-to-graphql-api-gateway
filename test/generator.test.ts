import Generator from "../src/generator";
import fs from 'fs';
import { loadYaml, convertToOas3 } from '../src/oas';
import * as helper from '../src/helper'
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
} from '../src/helper';


import Handlebars from 'handlebars';

//yarn jest --clearCache  

jest.mock('fs/promises');
jest.mock('../src/helper');
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
jest.mock('../src/oas', () => ({
  loadYaml: jest.fn(),
  convertToOas3: jest.fn(),
}));
jest.mock('oas-normalize', () => {
  return jest.fn().mockImplementation(() => ({
    deref: jest.fn(),
  }));
});

describe('Generator Class Tests', () => {
    let generator: Generator;

    beforeEach(() => {
        generator = new Generator('/mock/dir/specDir');
      });

    test('Placeholder test', () => {
        expect(true).toBe(true);
      });

      describe('readFilesInDirectory', () => {
        it('should populate specDirFiles with YAML files', async () => {
          (fs.promises.readdir as jest.Mock).mockResolvedValue(['file1.yaml', 'file2.yml', 'file3.json']);
          (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    
          await generator.readFilesInDirectory();
    
          expect(generator.specDirFiles).toEqual([
            '/mock/dir/specDir/file1.yaml',
            '/mock/dir/specDir/file2.yml',
          ]);
        });
    
        it('should handle errors gracefully', async () => {
          const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
          (fs.promises.readdir as jest.Mock).mockRejectedValue(new Error('Read directory error'));
        
          await generator.readFilesInDirectory();
        
          expect(generator.specDirFiles).toEqual([]);
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
          (OASNormalize as any).mockImplementation(() => mockOas);
      
          const result = await generator.parseSpec('mock/file/path');
      
          expect(result).toEqual(mockSpec);
          expect(OASNormalize).toHaveBeenCalledWith('mock/file/path', { enablePaths: true });
          expect(mockOas.deref).toHaveBeenCalled();
        });
      });

      describe('groupSpecPathsByTags', () => {
        it('should return {} when no tag', () => {
          const paths = {
            '/path1': {
              get: {
                summary: 'This is get ops',
                description: 'test test',
                'x-visibility': 'public',
                operationId: 'operation1',
                responses: {

                }
              },
            },
            '/path2': {
              post: { 
                summary: 'This is post ops',
                description: 'test test',
                'x-visibility': 'public',
                operationId: 'operation2',
                responses: {

                }
               },
            },
          };

          const grouped = generator.groupSpecPathsByTags(paths);

          const transformedGrouped = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          console.log("Grouped Output:", transformedGrouped)

          expect(transformedGrouped).toEqual({

          })


        })

        it('should return {} when tag array is empty', () => {
          const paths = {
            '/path1': {
              get: {
                summary: 'This is get ops',
                description: 'test test',
                'x-visibility': 'public',
                operationId: 'operation1',
                tags: [],
                responses: {

                }
              },
            },
            '/path2': {
              post: { 
                summary: 'This is post ops',
                description: 'test test',
                'x-visibility': 'public',
                operationId: 'operation2',
                tags: [],
                responses: {

                }
               },
            },
          };

          const grouped = generator.groupSpecPathsByTags(paths);

          const transformedGrouped = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          expect(transformedGrouped).toEqual({
            
          })


        })


        it('should group paths by tags', () => {
          const paths = {
            '/path1': {
              get: {
                summary: 'This is get ops',
                description: 'test test',
                'x-visibility': 'public',
                operationId: 'operation1',
                tags: ['tag1'],
                responses: {

                }
              },
            },
            '/path2': {
              post: { 
                summary: 'This is post ops',
                description: 'test test',
                'x-visibility': 'public',
                operationId: 'operation2',
                tags: ['tag2'],
                responses: {

                }
               },
            },
          };
    
          const grouped = generator.groupSpecPathsByTags(paths);

          const transformedGrouped = Object.keys(grouped).reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
          }, {});

          expect(transformedGrouped).toEqual({
            tag1: {
              '/path1': {
                get: { 
                  summary: 'This is get ops',
                  description: 'test test',
                  'x-visibility': 'public',
                  operationId: 'operation1',
                  tags: ['tag1'],
                  responses: {
  
                  }
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
                  responses: {
  
                  }
                 },
              },
            },
          });


        });
      });


      describe('generateGraphqlFoldersForService', () => {
        it('should create required folders', () => {
          (toPascalCase as jest.Mock).mockReturnValue('MockService');
    
          generator.generateGraphqlFoldersForService('mockService');
    
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
    
          const types = generator.convertSchemaToGraphQLTypes(schema);
    
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
      });

      describe('convertSchemaToGraphQLTypes', () => {

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
        
          const generator = new Generator('/mock/spec/dir');
          const graphqlTypes = generator.convertSchemaToGraphQLTypes(schema, 'RootObject');
        
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
        
          const generator = new Generator('/mock/spec/dir');
          const result = generator.convertSchemaToGraphQLTypes(schema, 'RootObject');

          console.dir(result, { depth: null, colors: true })

        
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




     
      });
    
    





})

