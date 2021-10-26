import { Command } from 'commander';
import mkdirp from 'mkdirp';
import path from 'path';
import { toCamelCase } from './camel-case';

export const createDirectory = (dirPath: string[]) => {
  const pathToCreate = path.isAbsolute(path.join(...dirPath))
    ? dirPath
    : [process.cwd(), ...dirPath];

  const p = path.join(...pathToCreate);
  mkdirp.sync(p);
  return p;
};

export const createModulePath = (
  program: Command,
  moduleName: string,
): string =>
  createDirectory([
    program.opts().destination,
    'modules',
    toCamelCase(moduleName),
  ]);
