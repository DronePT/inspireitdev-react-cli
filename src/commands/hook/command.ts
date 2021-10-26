import { Command } from 'commander';
import { createHookAction } from './create-hook';

export const install = (program: Command) => {
  program
    .command('hook')
    .arguments('<module> <hook-name>')
    .option('-f --force', 'Overwrite any existing file.')
    .action(createHookAction(program));
};
