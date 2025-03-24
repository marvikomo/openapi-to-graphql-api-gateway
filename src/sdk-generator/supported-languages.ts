// Supported languages and frameworks
export const LANGUAGE_CONFIGS = {
    // Core languages
    'typescript-fetch': { 
      extension: 'ts',
      templateDir: 'templates/typescript-fetch',
      defaultPackageManager: 'npm',
      supportedFeatures: ['auth', 'validation', 'pagination', 'streaming', 'retry', 'batch', 'ssr']
    },
    'typescript-axios': { 
      extension: 'ts',
      templateDir: 'templates/typescript-axios',
      defaultPackageManager: 'npm',
      supportedFeatures: ['auth', 'validation', 'pagination', 'retry', 'batch']
    },
    'typescript-node': { 
      extension: 'ts',
      templateDir: 'templates/typescript-node',
      defaultPackageManager: 'npm',
      supportedFeatures: ['auth', 'validation', 'streaming', 'retry', 'batch']
    },
    'javascript': { 
      extension: 'js',
      templateDir: 'templates/javascript',
      defaultPackageManager: 'npm',
      supportedFeatures: ['auth', 'validation', 'pagination']
    },
    'python': { 
      extension: 'py',
      templateDir: 'templates/python',
      defaultPackageManager: 'pip',
      supportedFeatures: ['auth', 'validation', 'pagination', 'streaming']
    },
    'java-resttemplate': { 
      extension: 'java',
      templateDir: 'templates/java-resttemplate',
      defaultPackageManager: 'maven',
      supportedFeatures: ['auth', 'validation', 'pagination']
    }
  };