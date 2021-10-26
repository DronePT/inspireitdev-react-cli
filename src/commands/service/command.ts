import { Command } from 'commander';
import { createServiceAction } from './create-service';

export const install = (program: Command) => {
  program
    .command('service')
    .arguments('<module> <service-name>')
    .option('-f --force', 'Overwrite any existing file.')
    .action(createServiceAction(program));
};
