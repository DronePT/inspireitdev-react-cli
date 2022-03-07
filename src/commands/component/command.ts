import { Command } from 'commander';
import path from 'path';
import { createComponentAction } from './create-component';
import { createSharedComponent } from './create-shared-component';

export const install = (program: Command) => {
  program
    .command('component')
    .addHelpText(
      'after',
      `
Example 1: Create inside a module
inspire-react component auth login-form

Example 2: Create a shared component
inspire-react component text-field

Example 2: Create a component on a custom directory
inspire-react component src/auth/LoginForm header
    `,
    )
    .argument(
      '<module-or-component-or-path>',
      'Module name, shared component name or a custom path.',
    )
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
          customDirectory: componentOrModule.includes(path.sep),
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
