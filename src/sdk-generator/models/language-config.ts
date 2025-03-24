export interface LanguageConfig {
    extension: string;
    templateDir: string;
    defaultPackageManager: string;
    supportedFeatures: string[];
    generatorType: string;
    specificArgs?: Record<string, any>;
  }