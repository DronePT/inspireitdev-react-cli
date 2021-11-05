import { Command } from 'commander';
import { createComponentAction } from './create-component';
import { createSharedComponent } from './create-shared-component';

export const install = (program: Command) => {
  program
    .command('component')
    .argument('<module-or-component>', 'Module name or component name')
    .argument('[component-name]', 'Name of the component to create')
    .option('-f --force', 'Overwrite any existing file.')
    .action(
      (
        componentOrModule: string,
        component: string,
        options: Record<string, unknown>,
      ) => {
        const opts = {
          ...program.opts<{ destination: string }>(),
          ...options,
          customDirectory: componentOrModule.includes('/'),
        };

        if (!component) {
          return createSharedComponent(componentOrModule, opts);
        }

        return createComponentAction(
          program,
          componentOrModule,
          component,
          opts,
        );
      },
    );
};
