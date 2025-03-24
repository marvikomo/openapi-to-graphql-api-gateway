export interface OpenAPIExtensions {
    serviceId: string;
    organization: string;
    sourceRepository?: string;
    clientOptions?: Record<string, any>;
    operationGroups?: Record<string, string[]>;
    authMethods?: string[];
    docsUrl?: string;
    commonModels?: Record<string, string>;
  }