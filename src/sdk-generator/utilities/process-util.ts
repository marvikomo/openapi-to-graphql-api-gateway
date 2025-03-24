import { execSync } from 'child_process';

export class ProcessUtils {
  /**
   * Execute shell command
   */
  public static executeCommand(command: string, options: { verbose?: boolean } = {}): string {
    try {
      return execSync(command, {
        stdio: options.verbose ? 'inherit' : 'pipe',
        encoding: 'utf8'
      });
    } catch (error) {
      throw new Error(`Command execution failed: ${(error as Error).message}`);
    }
  }
  
  /**
   * Execute shell command and ignore errors
   */
  public static executeCommandSafe(command: string, options: { verbose?: boolean } = {}): string | null {
    try {
      return this.executeCommand(command, options);
    } catch (error) {
      if (options.verbose) {
        console.warn(`Command failed (ignoring): ${command}`);
        console.warn((error as Error).message);
      }
      return null;
    }
  }
}