import { Command } from 'commander';
import path from 'path';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { Tasks } from '../../utils/tasks';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

export const createUtilAction =
  (program: Command) =>
  async (
    utilNameOrPath: string,
    utilName: string,
    options: { force?: boolean },
  ) => {
    const tasks = Tasks.create();

    if (!utilName) {
      // eslint-disable-next-line no-param-reassign
      utilName = path.basename(utilNameOrPath);
      // eslint-disable-next-line no-param-reassign
      utilNameOrPath = path.join(
        program.opts().destination,
        path.dirname(utilNameOrPath),
      );
    }

    const utilBasePath = utilNameOrPath.split(path.sep);

    const utilPath = createDirectory([...utilBasePath, 'utils']);
    tasks.add('create-path', utilPath.data, utilPath.exec);

    const util = toHyphen(utilName);

    const fileToCreate = createFile(
      utilPath.data,
      `${util}.util.ts`,
      getFromTemplate([__dirname, 'create-util.tpl'], {
        util: toCamelCase(util),
      }),
      options?.force === true,
    );

    tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

    if (await tasks.run()) {
      await createExportFile(utilPath.data, 'utils'); // export util
    }
  };
