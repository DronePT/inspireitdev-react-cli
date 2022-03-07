import { Command } from 'commander';
import path from 'path';
import { createHookAction } from './create-hook';
import { createSharedHookAction } from './create-shared-hook';

export const install = (program: Command) => {
  program
    .command('hook')
    .addHelpText(
      'after',
      `
Example 1: Create inside a module
inspire-react hook auth login

Example 2: Create a shared hook
inspire-react hook key-press

Example 2: Create a hook on a custom directory
inspire-react hook src/custom/path key-press
    `,
    )
    .argument(
      '<module-or-hook-or-path>',
      'Module name, shared hook name or a custom path.',
    )
    .argument('[hook-name]', 'Name of the hook to create')
    .option('-f --force', 'Overwrite any existing file.')
    .action(
      async (
        moduleName: string,
        hookName: string,
        options: { force?: boolean },
      ) => {
        const opts = {
          ...program.opts<{ destination: string }>(),
          ...options,
          customDirectory: moduleName.includes(path.sep),
        };

        if (!hookName) {
          await createSharedHookAction(program, moduleName, opts);
          return;
        }

        await createHookAction(program, moduleName, hookName, opts);
      },
    );
};
