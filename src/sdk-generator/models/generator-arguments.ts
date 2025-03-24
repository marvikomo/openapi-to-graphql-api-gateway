export interface GeneratorArguments {
    [key: string]: any;
    configOptions?: {
      [key: string]: any;
    };
    'generator-name'?: string;
    output?: string;
    'input-spec'?: string;
    'template-dir'?: string;
    'git-repo-id'?: string;
    'git-user-id'?: string;
    'api-package'?: string;
    'model-package'?: string;
    'artifact-version'?: string;
    'import-mappings'?: string;
  }