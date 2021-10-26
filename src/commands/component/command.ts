import { Command } from 'commander';
import { createComponentAction } from './create-component';
import { createSharedComponent } from './create-shared-component';

export const install = (program: Command) => {
  program
    .command('component')
    .argument('<module-or-component>', 'Module name or component name')
    .argument('[component-name]', 'Name of the component to create')
    .argument(
      '[directory]',
      'Custom location to create this component (relative to module path)',
    )
    .option('-f --force', 'Overwrite any existing file.')
    .action(
      (
        componentOrModule: string,
        component: string,
        customDirectory: string,
        options: Record<string, unknown>,
      ) => {
        if (!component) {
          return createSharedComponent(componentOrModule, {
            ...program.opts(),
            ...options,
          });
        }

        return createComponentAction(
          program,
          componentOrModule,
          component,
          customDirectory,
          options,
        );
      },
    );
};
