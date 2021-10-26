import fs from 'fs';
import path from 'path';

export const createFile = (
  filepath: string,
  filename: string,
  content: string,
) => {
  fs.writeFileSync(path.join(filepath, filename), content);
};

export const createExportFile = (
  filepath: string | string[],
  recursiveUntilPath = 'modules',
): void => {
  const dir = Array.isArray(filepath)
    ? path.join(...filepath)
    : path.join(filepath);

  const basename = path.basename(dir).toLowerCase();

  const filesAndDirs = fs
    .readdirSync(dir)
    .filter((f) => f.indexOf('index') < 0)
    .map((f) => {
      const isDir = fs.statSync(path.join(dir, f)).isDirectory();
      const fd = path.basename(f, path.extname(f));

      return {
        isDir,
        value: `export * from './${fd}'`,
      };
    });

  const content = filesAndDirs.map((f) => f.value).join('\n');

  createFile(dir, 'index.ts', `${content}\n`);

  const newDir = path.join(dir, '..');

  if (basename !== recursiveUntilPath && newDir !== process.cwd()) {
    createExportFile(newDir, recursiveUntilPath);
  }
};
