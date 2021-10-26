import { Command } from 'commander';
import { createComponentAction } from './create-component';

export const install = (program: Command) => {
  program
    .command('component')
    .argument('<module>', 'Module name')
    .argument('<component-name>', 'Name of the component to create')
    .argument(
      '[directory]',
      'Custom location to create this component (relative to module path)',
    )
    .option('-f --force', 'Overwrite any existing file.')
    .action(createComponentAction(program));
};
