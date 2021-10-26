import { Command } from 'commander';
import { createStoreAction } from './create-store';

export const install = (program: Command) => {
  program
    .command('store')
    .arguments('<module> <store-name>')
    .option('-f --force', 'Overwrite any existing file.')
    .action(createStoreAction(program));
};
