import { Command } from 'commander';
import { createFileAction } from './create-file';

export const install = (program: Command) => {
  program
    .command('file')
    .argument('<file-path>', 'File path')
    .option('-f --force', 'Overwrite any existing file.')
    .action(createFileAction(program));
};
