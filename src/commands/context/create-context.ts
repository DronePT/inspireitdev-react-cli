import { Command } from 'commander';
import path from 'path';

import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { Tasks } from '../../utils/tasks';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

interface CreateContextOptions {
  customDirectory: boolean;
  force?: boolean | undefined;
  destination: string;
}

export const createContextAction = async (
  program: Command,
  moduleName: string,
  contextName: string,
  options: CreateContextOptions,
) => {
  const tasks = Tasks.create();

  const modulePath = options.customDirectory
    ? createDirectory(moduleName.split(path.sep))
    : createModulePath(program, moduleName);

  tasks.add('create-path', modulePath.data, modulePath.exec);

  const contextPath = createDirectory([modulePath.data, 'contexts']);

  tasks.add('create-path', contextPath.data, contextPath.exec);

  const context = toHyphen(contextName);

  const fileToCreate = createFile(
    contextPath.data,
    `${context}.context.tsx`,
    getFromTemplate([__dirname, 'create-context.tpl'], {
      context: toCamelCase(context),
    }),
    options?.force === true,
  );

  tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

  if (await tasks.run()) {
    await createExportFile(
      contextPath.data,
      options.customDirectory ? 'contexts' : undefined,
    ); // export context
  }
};
