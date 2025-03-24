export interface SDKGeneratorConfig {
    version: string;
    generatorCommand: string;
    githubRepository: string;
    githubOrganization: string;
    packageName: string;
    developerName: string;
    developerEmail: string;
    developerOrganization: string;
    customMappings?: Record<string, Record<string, string>>;
  }