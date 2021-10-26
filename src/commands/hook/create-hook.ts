import { Command } from 'commander';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

export const createHookAction =
  (program: Command) =>
  async (moduleName: string, hookName: string, options: any) => {
    const hookPath = createDirectory([
      createModulePath(program, moduleName),
      'hooks',
    ]);

    const hook = toHyphen(hookName);

    await createFile(
      hookPath,
      `use-${hook}.hook.ts`,
      getFromTemplate([__dirname, 'create-hook.tpl'], {
        hook: toCamelCase(hook),
      }),
      options?.force === true,
    );

    await createExportFile(hookPath); // export hook
  };
