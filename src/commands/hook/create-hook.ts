import { Command } from 'commander';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { Tasks } from '../../utils/tasks';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

export const createHookAction =
  (program: Command) =>
  async (
    moduleName: string,
    hookName: string,
    options: { force?: boolean },
  ) => {
    const opts = {
      ...program.opts<{ destination: string }>(),
      ...options,
      customDirectory: moduleName.includes('/'),
    };

    const tasks = Tasks.create();

    const modulePath = opts.customDirectory
      ? createDirectory(moduleName.split('/'))
      : createModulePath(program, moduleName);

    tasks.add('create-path', modulePath.data, modulePath.exec);

    const hookPath = createDirectory([modulePath.data, 'hooks']);

    tasks.add('create-path', hookPath.data, hookPath.exec);

    const hook = toHyphen(hookName);

    const fileToCreate = createFile(
      hookPath.data,
      `use-${hook}.hook.ts`,
      getFromTemplate([__dirname, 'create-hook.tpl'], {
        hook: toCamelCase(hook),
      }),
      opts?.force === true,
    );

    tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

    if (await tasks.run()) {
      await createExportFile(hookPath.data); // export hook
    }
  };
