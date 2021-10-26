#!/usr/bin/env node

import { Command } from 'commander';

import * as componentCommand from './commands/component';
import * as hookCommand from './commands/hook';
import * as pageCommand from './commands/page';
import * as serviceCommand from './commands/service';
import * as storeCommand from './commands/store';
import * as domainCommand from './commands/domain';
import * as utilCommand from './commands/util';
import * as fileCommand from './commands/file';
import * as createAppCommand from './commands/create-app';

import { getVersion } from './utils/get-version';

const program = new Command();

program
  .version(getVersion())
  .description('CLI tool to create resources for InspireIT React Boilerplate')
  .option(
    '-d --destination <destination>',
    'Where resources should be created.',
    './src',
  );

componentCommand.install(program);
hookCommand.install(program);
pageCommand.install(program);
serviceCommand.install(program);
storeCommand.install(program);
domainCommand.install(program);
utilCommand.install(program);
fileCommand.install(program);
createAppCommand.install(program);

(async () => {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error(error);
  }
})();
