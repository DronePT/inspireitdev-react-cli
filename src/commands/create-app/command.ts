import { Command } from 'commander';
import { createAppAction } from './create-app';

export const install = (program: Command) => {
  program
    .command('create-app')
    .argument('<app-name>', 'React Application name.')
    .action(createAppAction(program));
};
