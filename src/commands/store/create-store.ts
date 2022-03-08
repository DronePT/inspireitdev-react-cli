import { Command } from 'commander';
import inquirer from 'inquirer';
import path from 'path';

import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile } from '../../utils/file';
import { Tasks } from '../../utils/tasks';

import { toHyphen } from '../../utils/to-hyphen';
import { createRecoilStore } from './recoil/create-store-recoil';
import { createZustandStore } from './zustand/create-store-zustand';

export type StoreLibs = 'zustand' | 'redux' | 'recoil' | 'none';
export interface CreateStoreOptions {
  force?: boolean;
  lib?: StoreLibs;
}

type CreateStoreFn =
  | undefined
  | ((
      srcPath: string,
      storePath: string,
      store: string,
      options: CreateStoreOptions,
      task: Tasks,
    ) => Promise<void>);

const createStoreMap: Record<string, CreateStoreFn> = {
  zustand: createZustandStore,
  recoil: createRecoilStore,
};

export const createStoreAction =
  (program: Command) =>
  async (
    moduleName: string,
    storeName: string,
    options: CreateStoreOptions,
  ) => {
    const answers = await inquirer.prompt<{ lib: StoreLibs }>(
      [
        {
          type: 'list',
          name: 'lib',
          message: 'Choose state library',
          choices: [
            { checked: true, name: 'Zustand', value: 'zustand' },
            { checked: false, name: 'Recoil', value: 'recoil' },
            { checked: false, name: 'Redux', value: 'redux', disabled: true },
          ],
        },
      ],
      options,
    );

    const opts = {
      ...program.opts<{ destination: string }>(),
      ...options,
      customDirectory: moduleName.includes(path.sep),
    };

    const tasks = Tasks.create();

    const modulePath = opts.customDirectory
      ? createDirectory(moduleName.split(path.sep))
      : createModulePath(program, moduleName);

    tasks.add('create-path', modulePath.data, modulePath.exec);

    const storePath = createDirectory([modulePath.data, 'store']);

    tasks.add('create-path', storePath.data, storePath.exec);

    const store = toHyphen(storeName);

    const create = createStoreMap[answers.lib];

    if (!create) {
      console.warn(`${answers.lib} isn't available yet!`);
      return;
    }

    const srcPath = path.join(process.cwd(), program.opts().destination);

    await create(srcPath, storePath.data, store, options, tasks);

    if (await tasks.run()) {
      await createExportFile(storePath.data); // export store
    }
  };
