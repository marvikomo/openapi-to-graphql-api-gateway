import Generator from "../src/generator";
import fs from 'fs';
import { loadYaml, convertToOas3 } from '../src/oas';
import * as helper from '../src/helper'
import * as path from 'path';


import Handlebars from 'handlebars';

//yarn jest --clearCache  

jest.mock('fs/promises');
jest.mock('../src/helper');
jest.mock('handlebars');
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




})

