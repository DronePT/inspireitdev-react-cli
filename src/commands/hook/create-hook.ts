import { Command } from 'commander';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

export const createHookAction =
  (program: Command) => (moduleName: string, hookName: string) => {
    const hookPath = createDirectory([
      createModulePath(program, moduleName),
      'hooks',
    ]);

    const hook = toHyphen(hookName);

    createFile(
      hookPath,
      `use-${hook}.hook.ts`,
      getFromTemplate([__dirname, 'create-hook.tpl'], {
        hook: toCamelCase(hook),
      }),
    );

    createExportFile(hookPath); // export hook
  };
