import { toCamelCase } from '../../../utils/camel-case';
import { createFile } from '../../../utils/file';
import { getFromTemplate } from '../../../utils/template';
import { CreateStoreOptions } from '../create-store';

export async function createRecoilStore(
  srcPath: string,
  storePath: string,
  store: string,
  options: CreateStoreOptions,
) {
  await createFile(
    storePath,
    `${store}.store.ts`,
    getFromTemplate([__dirname, 'create-store-recoil.tpl'], {
      store: toCamelCase(store),
      lStore: toCamelCase(store, false),
    }),
    options?.force === true,
  );
}
