import { Command } from 'commander';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

export const createStoreAction =
  (program: Command) =>
  async (moduleName: string, storeName: string, options: any) => {
    const storePath = createDirectory([
      createModulePath(program, moduleName),
      'store',
    ]);

    const store = toHyphen(storeName);

    await createFile(
      storePath,
      `${store}.store.ts`,
      getFromTemplate([__dirname, 'create-store.tpl'], {
        store: toCamelCase(store),
      }),
      options?.force === true,
    );

    await createExportFile(storePath); // export store
  };
