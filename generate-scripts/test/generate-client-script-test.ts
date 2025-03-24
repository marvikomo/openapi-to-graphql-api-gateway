import { program } from '../generate-client-script'; 
import { Command } from 'commander';

describe('CLI Program', () => {
  let mockExit: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;

  beforeEach(() => {
    // Mock process.exit and console.error
    mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
      throw new Error(`process.exit called with code ${code}`);
    });
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });


  describe('command', () => {

  it('should have the correct name', () => {
    expect(program.name()).toBe('generate-clients');
  });

  it('should throw an error when required options are not passed', async () => {
    program.exitOverride();

    try {
      // Simulate CLI without required options
      await program.parseAsync(['node', 'generate-client-script', 'generate']);
    } catch (error) {
      expect(error.message).toContain('process.exit called with code 1');
    }

    // Verify console.error was called
    expect(mockConsoleError).toHaveBeenCalled();
    const errorMessage = mockConsoleError.mock.calls[0][0];
    expect(errorMessage).toContain('error: required option');
  });


})





});