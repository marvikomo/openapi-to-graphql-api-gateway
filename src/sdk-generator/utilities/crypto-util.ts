import * as crypto from 'crypto';

export class CryptoUtils {
  /**
   * Generate SHA-256 hash as hex string
   */
  public static sha256hex(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }
  
  /**
   * Generate version hash from content
   */
  public static generateVersionHash(version: string, content: string): string {
    return `${version}-${this.sha256hex(content)}`;
  }
}