import { Command } from 'commander';
import { createUtilAction } from './create-util';

export const install = (program: Command) => {
  program
    .command('util')
    .argument(
      '<path-or-util-name>',
      'Path where to create the util or utility name.',
    )
    .argument('[util-name]', 'Utility name.')
    .option('-f --force', 'Overwrite any existing file.')
    .action(createUtilAction(program));
};
