import { Command } from 'commander';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

export const createUtilAction =
  (program: Command) => async (utilName: string, options: any) => {
    const utilPath = createDirectory([program.opts().destination, 'utils']);

    const util = toHyphen(utilName);

    await createFile(
      utilPath,
      `${util}.util.ts`,
      getFromTemplate([__dirname, 'create-util.tpl'], {
        util: toCamelCase(util),
      }),
      options?.force === true,
    );

    await createExportFile(utilPath, 'utils'); // export util
  };
