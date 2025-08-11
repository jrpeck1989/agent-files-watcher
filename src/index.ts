#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { buildCommand } from './commands/build';
import { watchCommand } from './commands/watch';
import { validateCommand } from './commands/validate';
import { serveCommand } from './commands/serve';

const program = new Command();

program
  .name('agent-context')
  .description('A CLI and server for managing and serving agent context.')
  .version('0.0.1');

// Placeholder for commands
program.command('init')
  .description('Scaffold a new project')
  .action(initCommand);

program.command('build')
  .description('Build the physical agent files')
  .action(buildCommand);

program.command('watch')
  .description('Watch for changes and rebuild files')
  .action(watchCommand);

program.command('serve')
  .description('Start the interactive MCP server')
  .option('--stdio', 'Use stdio for communication instead of HTTP')
  .action(serveCommand);

program.command('validate')
  .description('Validate that the generated files are up-to-date')
  .action(validateCommand);

program.parse(process.argv);
