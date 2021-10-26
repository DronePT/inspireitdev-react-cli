#!/usr/bin/env node

import { Command } from 'commander';

import * as componentCommand from './commands/component/command';
import * as hookCommand from './commands/hook/command';
import * as pageCommand from './commands/page/command';

const program = new Command();

program
  .version('0.0.1')
  .description('CLI tool to create resources for InspireIT React Boilerplate')
  .option(
    '-d --destination <destination>',
    'Where resources should be created.',
    './src',
  );

componentCommand.install(program);
hookCommand.install(program);
pageCommand.install(program);

program.parse(process.argv);
