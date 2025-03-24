export const LANGUAGE_CONFIGS: Record<string, any> = {
    'typescript-fetch': { 
      extension: 'ts',
      templateDir: 'templates/typescript-fetch',
      defaultPackageManager: 'npm',
      generatorType: 'typescript-fetch',
      supportedFeatures: ['auth', 'validation', 'pagination', 'streaming', 'retry', 'batch', 'ssr']
    },
    'typescript-axios': { 
      extension: 'ts',
      templateDir: 'templates/typescript-axios',
      defaultPackageManager: 'npm',
      generatorType: 'typescript-axios',
      supportedFeatures: ['auth', 'validation', 'pagination', 'retry', 'batch']
    },
    'typescript-node': { 
      extension: 'ts',
      templateDir: 'templates/typescript-node',
      defaultPackageManager: 'npm',
      generatorType: 'typescript-node',
      supportedFeatures: ['auth', 'validation', 'streaming', 'retry', 'batch']
    },
    'javascript': { 
      extension: 'js',
      templateDir: 'templates/javascript',
      defaultPackageManager: 'npm',
      generatorType: 'javascript',
      supportedFeatures: ['auth', 'validation', 'pagination']
    },
    'python': { 
      extension: 'py',
      templateDir: 'templates/python',
      defaultPackageManager: 'pip',
      generatorType: 'python',
      supportedFeatures: ['auth', 'validation', 'pagination', 'streaming']
    },
    'java-resttemplate': { 
      extension: 'java',
      templateDir: 'templates/java-resttemplate',
      defaultPackageManager: 'maven',
      generatorType: 'java',
      specificArgs: { library: 'resttemplate' },
      supportedFeatures: ['auth', 'validation', 'pagination']
    },
    'dart-dio': { 
      extension: 'dart',
      templateDir: 'templates/dart-dio',
      defaultPackageManager: 'pub',
      generatorType: 'dart-dio',
      supportedFeatures: ['auth', 'validation', 'pagination']
    },
    'rust': { 
      extension: 'rs',
      templateDir: 'templates/rust',
      defaultPackageManager: 'cargo',
      generatorType: 'rust',
      supportedFeatures: ['auth', 'validation', 'pagination', 'streaming']
    },
    'go': {
      extension: 'go',
      templateDir: 'templates/go',
      defaultPackageManager: 'go',
      generatorType: 'go',
      supportedFeatures: ['auth', 'validation', 'pagination']
    }
  };


  // Base arguments for generator
export const BASE_GENERATOR_ARGS = {
    "output": "_OUTPUT_",
    "input-spec": "_INPUT_SPEC_",
    "git-repo-id": "_GIT_REPO_ID_",
    "git-user-id": "_GIT_USER_ID_",
    "api-package": "_PACKAGE_",
    "model-package": "_PACKAGE_.models",
    "artifact-version": "_ARTIFACT_VERSION__SNAPSHOT_"
  };


  export const IS_RELEASE = process.env.GITHUB_REF === 'refs/heads/main';