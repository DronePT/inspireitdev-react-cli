import { Command } from 'commander';
import { createUtilAction } from './create-util';

export const install = (program: Command) => {
  program
    .command('util')
    .argument('<util-name>', 'Utility name.')
    .option('-f --force', 'Overwrite any existing file.')
    .action(createUtilAction(program));
};
