import { BASE_GENERATOR_ARGS, IS_RELEASE } from "./constants";
import { GeneratorArguments } from "./models/generator-arguments";
import { SDKGeneratorConfig } from "./models/generator-config";
import { LANGUAGE_CONFIGS } from "./supported-languages";
import { StringUtils } from "./utilities/string-util";


export class ArgumentsService { 

   /**
   * Generate the template arguments for all supported languages
   */
   public generateTemplateArguments(config: SDKGeneratorConfig): Record<string, GeneratorArguments> {
    // Construct arguments for each language
    const allArgs: Record<string, GeneratorArguments> = {};
    
    for (const lang of Object.keys(LANGUAGE_CONFIGS)) {
      const langConfig = LANGUAGE_CONFIGS[lang];
      const specificArgs = langConfig.specificArgs || {};
      
      // Start with base args
      let langArgs: GeneratorArguments = { ...BASE_GENERATOR_ARGS };
      
      // Add generator name
      langArgs['generator-name'] = langConfig.generatorType;
      
      // Add language-specific arguments
      langArgs = { ...langArgs, ...specificArgs };
      
      // Add custom mappings if provided
      if (config.customMappings && config.customMappings[lang]) {
        langArgs['type-mappings'] = Object.entries(config.customMappings[lang])
          .map(([key, value]) => `${key}=${value}`)
          .join(',');
      }
      
      allArgs[lang] = langArgs;
    }

    // Substitute template values
    const SNAPSHOT_NUMBER = Math.round(Date.now() / 10000);
    return StringUtils.substituteProperties(allArgs, {
      '_GIT_REPO_ID_': config.githubRepository.split('/').pop() || '',
      '_GIT_USER_ID_': config.githubOrganization.toLowerCase(),
      '_SNAPSHOT_': IS_RELEASE ? '' : `${SNAPSHOT_NUMBER}`,
      '_ARTIFACT_VERSION_': config.version,
      '_VERSION_SUFFIX_': IS_RELEASE ? 'RELEASE' : 'SNAPSHOT',
      '_PUB_VERSION_': `${config.version}${IS_RELEASE ? '' : '-SNAPSHOT.' + SNAPSHOT_NUMBER}`,
      '_ARTIFACT_URL_': `https://github.com/${config.githubRepository}`,
      '_DEVELOPER_NAME_': config.developerName,
      '_DEVELOPER_EMAIL_': config.developerEmail,
      '_DEVELOPER_ORGANIZATION_': config.developerOrganization,
      '_ARTIFACT_GROUP_ID_': config.packageName,
    });
  }



}