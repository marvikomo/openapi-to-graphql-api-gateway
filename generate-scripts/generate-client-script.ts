//Accept github_repo id
//Accept github user id
//Accept developer name
//Accept github organization
//Accept github artifact repository
//Accept developer organization //optional e.g burrow tech
//Accept package name

import { Command } from 'commander';

export const program = new Command();

program
  .name('generate-clients')
  .description('A simple command-line tool to generate clients from OpenAPI specs')
  .version('1.0.0');

  program
  .command('generate')
  .description('Generate clients from OpenAPI specs')
  .requiredOption('-s, --spec <spec>', 'Path to the OpenAPI spec file')
  .requiredOption('-o, --output <output>', 'Output directory for generated clients')
  .requiredOption('-l, --lang <language>', 'Programming language for the client (e.g., typescript, java)')
  .action((options) => {
    console.log('Generate command executed with options:', options);
  });



