import { Command } from 'commander';
import mkdirp from 'mkdirp';
import path from 'path';
import fsExtra from 'fs-extra';

import { toCamelCase } from './camel-case';

export const createDirectory = (dirPath: string[]) => {
  const pathToCreate = path.isAbsolute(path.join(...dirPath))
    ? dirPath
    : [process.cwd(), ...dirPath];

  const p = path.join(...pathToCreate);

  return {
    exists: fsExtra.existsSync(p),
    data: p,
    exec: () => {
      mkdirp.sync(p);
    },
  };
};

export const createModulePath = (program: Command, moduleName: string) =>
  createDirectory([
    program.opts().destination,
    'modules',
    toCamelCase(moduleName),
  ]);
