import { Command } from 'commander';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

export const createStoreAction =
  (program: Command) => (moduleName: string, storeName: string) => {
    const storePath = createDirectory([
      createModulePath(program, moduleName),
      'store',
    ]);

    const store = toHyphen(storeName);

    createFile(
      storePath,
      `${store}.store.ts`,
      getFromTemplate([__dirname, 'create-store.tpl'], {
        store: toCamelCase(store),
      }),
    );

    createExportFile(storePath); // export store
  };
