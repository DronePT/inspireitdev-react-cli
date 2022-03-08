import { Command } from 'commander';

import { toCamelCase } from '../../utils/camel-case';
import { createDirectory } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { Tasks } from '../../utils/tasks';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

interface CreateContextOptions {
  customDirectory: boolean;
  force?: boolean | undefined;
  destination: string;
}

export const createSharedContextAction = async (
  program: Command,
  contextName: string,
  options: CreateContextOptions,
) => {
  const tasks = Tasks.create();

  const contextPath = createDirectory([options.destination, 'contexts']);

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
    await createExportFile(contextPath.data, 'contexts'); // export context
  }
};
