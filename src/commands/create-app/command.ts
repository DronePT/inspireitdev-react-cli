import { Command } from 'commander';
import { createAppAction } from './create-app';

export const install = (program: Command) => {
  program
    .command('create-app')
    .argument('<app-name>', 'React Application name.')
    .option('-c --copy-only', 'Copy template files only.')
    .option('--use-npm', 'Use NPM instead of Yarn.')
    .option('-s --state-lib', 'State library.')
    .action(createAppAction);
};
