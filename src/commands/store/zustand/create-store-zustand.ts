// import { toCamelCase } from '../../utils/camel-case';
// import { createFile } from '../../utils/file';
// import { getFromTemplate } from '../../utils/template';
import path from 'path';
import fsExtra from 'fs-extra';

import { toCamelCase } from '../../../utils/camel-case';
import { createFile } from '../../../utils/file';
import { getFromTemplate } from '../../../utils/template';
import { CreateStoreOptions } from '../create-store';
import { Tasks } from '../../../utils/tasks';

export async function createZustandStore(
  srcPath: string,
  storePath: string,
  store: string,
  options: CreateStoreOptions,
  task: Tasks,
) {
  const fileToCreate = createFile(
    storePath,
    `${store}.store.ts`,
    getFromTemplate([__dirname, 'create-store-zustand.tpl'], {
      store: toCamelCase(store),
      lStore: toCamelCase(store, false),
    }),
    options?.force === true,
  );

  task.add('create-file', fileToCreate.data, fileToCreate.exec);

  const appStorePath = path.join(srcPath, 'store/store.ts');

  const appStore = (await fsExtra.readFileSync(appStorePath)).toString();

  // store: read current stores
  const createStoreName = `create${toCamelCase(store)}Slice`;
  const reStores = /(import {)([^]{0,})(} from ['|"]..\/modules['|"])/gi;
  const reState = /(StateFromFunctions<\[)([^]{0,})(\]>)/gi;
  const reExport =
    /(createStore(<AppState>){0,}\(\(set, get\) => \({)([^]{0,})(}\))/gi;

  const newAppStore = appStore
    .replace(
      reStores,
      (v, g1, g2, g3) =>
        `${g1}\n  ${Array.from(
          new Set(
            [...g2.split(','), createStoreName].map((r: string) => r.trim()),
          ),
        )
          .filter((r) => !!r)
          .join(',\n  ')}\n${g3}`,
    )
    .replace(
      reState,
      (v, g1, g2, g3) =>
        `${g1}\n  ${Array.from(
          new Set([...g2.split(','), `typeof ${createStoreName}`]),
        )
          .map((r: string) => r.trim())
          .filter((r) => !!r)
          .join(',\n  ')}\n${g3}`,
    )
    .replace(
      reExport,
      (v, g1, g2, g3, g4) =>
        `createStore<AppState>((set, get) => ({\n  ${Array.from(
          new Set([...g3.split('),'), `...${createStoreName}(set, get`]),
        )
          .map((r: string) => r.trim())
          .filter((r) => !!r)
          .join('),\n  ')}),\n${g4}`,
    );

  task.add('update', appStorePath, () =>
    fsExtra.writeFileSync(appStorePath, newAppStore),
  );
}
