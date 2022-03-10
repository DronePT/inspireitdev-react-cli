import { Command } from 'commander';
import { createCrudAction } from './create-crud';

export const install = (program: Command) => {
  program
    .command('crud')
    .argument('<module>', 'Module name.')
    .argument('<entity>', 'Name of the entity to create CRUD for.')
    .option('-f --force', 'Overwrite any existing file.')
    .action(createCrudAction(program));
};
