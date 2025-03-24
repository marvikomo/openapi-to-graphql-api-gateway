import _ from 'lodash';

export class StringUtils {
  /**
   * Convert string to  Java package name format
   */
  public static javaPackageNameFormatter(name: string): string {
    return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_');
  }
  
  /**
   * Convert string to  JavaScript module name format
   */
  public static jSModuleNameFormatter(name: string): string {
    return name.trim().split(/[^a-z0-9]+/).map(_.capitalize).join('');
  }
  
  /**
   * Remove special characters from string
   */
  public static stripSpecialChars(str: string): string {
    return str.replace(/[^a-zA-Z0-9_-]/g, '');
  }
  
  /**
   * Substitute template variables in an object
   */
  public static substituteProperties(obj: any, props: Record<string, string>): any {
    if (typeof obj === 'string') {
      let result = obj;
      for (const [key, value] of Object.entries(props)) {
        result = result.replace(new RegExp(key, 'g'), value || '');
      }
      return result;
    } else if (Array.isArray(obj)) {
      return obj.map(item => this.substituteProperties(item, props));
    } else if (obj && typeof obj === 'object') {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.substituteProperties(value, props);
      }
      return result;
    }
    return obj;
  }
}