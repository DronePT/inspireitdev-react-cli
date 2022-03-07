import { Command } from 'commander';
import path from 'path';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { Tasks } from '../../utils/tasks';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

interface CreateHookOptions {
  customDirectory: boolean;
  force?: boolean | undefined;
  destination: string;
}

export const createSharedHookAction = async (
  program: Command,
  hookName: string,
  options: CreateHookOptions,
) => {
  const tasks = Tasks.create();

  const hookPath = createDirectory([options.destination, 'hooks']);

  tasks.add('create-path', hookPath.data, hookPath.exec);

  const hook = toHyphen(hookName);

  const fileToCreate = createFile(
    hookPath.data,
    `use-${hook}.hook.ts`,
    getFromTemplate([__dirname, 'create-hook.tpl'], {
      hook: toCamelCase(hook),
    }),
    options?.force === true,
  );

  tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

  if (await tasks.run()) {
    await createExportFile(hookPath.data, 'hooks'); // export hook
  }
};
