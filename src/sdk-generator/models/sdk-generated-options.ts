export interface GeneratorOptions {
    specFiles: string[];
    languages: string[];
    outputDir: string;
    templatesDir?: string;
    includeTests?: boolean;
    includeExamples?: boolean;
    includeDocker?: boolean;
    skipDeploy?: boolean;
    skipValidation?: boolean;
    verbose?: boolean;
    dryRun?: boolean;
    enableHashTracking?: boolean;
  }