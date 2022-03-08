import { Command } from 'commander';
import path from 'path';
import { createContextAction } from './create-context';
import { createSharedContextAction } from './create-shared-context';

export const install = (program: Command) => {
  program
    .command('context')
    .addHelpText(
      'after',
      `
Example 1: Create inside a module
inspire-react context auth login

Example 2: Create a shared context
inspire-react context theme

Example 3: Create a context on a custom directory
inspire-react context src/custom/path theme
    `,
    )
    .argument(
      '<module-or-context-or-path>',
      'Module name, shared context name or a custom path.',
    )
    .argument('[context-name]', 'Name of the context to create')
    .option('-f --force', 'Overwrite any existing file.')
    .action(
      async (
        moduleName: string,
        contextName: string,
        options: { force?: boolean },
      ) => {
        const opts = {
          ...program.opts<{ destination: string }>(),
          ...options,
          customDirectory: moduleName.includes(path.sep),
        };

        if (!contextName) {
          await createSharedContextAction(program, moduleName, opts);
          return;
        }

        await createContextAction(program, moduleName, contextName, opts);
      },
    );
};
