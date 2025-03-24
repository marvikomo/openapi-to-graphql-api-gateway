export interface GenerationResult {
    specFile: string;
    language: string;
    outputPath: string;
    success: boolean;
    error?: string;
    skipped?: boolean;
    skipReason?: string;
    generatedFiles?: string[];
  }