import { Command } from 'commander';
import { createPageAction } from './create-page';

export const install = (program: Command) => {
  program
    .command('page')
    .arguments('<module> <page-name>')
    .option('-f --force', 'Overwrite any existing file.')
    .action(createPageAction(program));
};
