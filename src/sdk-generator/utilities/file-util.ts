import * as fs from 'fs';
import * as path from 'path';

export class FileUtils {
  /**
   * Get all files in a directory recursively
   */
  public static async getDirectoryFiles(dir: string): Promise<string[]> {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? this.getDirectoryFiles(res) : res;
    }));
    return files.flat();
  }

  /**
   * Create directory recursively if it doesn't exist
   */
  public static ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Check if a file exists and has the same content
   */
  public static fileExistsWithContent(filePath: string, content: string): boolean {
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    const existingContent = fs.readFileSync(filePath, 'utf8');
    return existingContent === content;
  }
  
  /**
   * Write to file only if content is different or file doesn't exist
   */
  public static writeFileIfDifferent(filePath: string, content: string): boolean {
    if (this.fileExistsWithContent(filePath, content)) {
      return false;
    }
    
    this.ensureDirectoryExists(path.dirname(filePath));
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  /**
   * Copy directory recursively
   */
  public static copyDirectory(src: string, dest: string): void {
    if (!fs.existsSync(src)) {
      return;
    }
    
    this.ensureDirectoryExists(dest);
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}