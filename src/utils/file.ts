import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';

const fileExists = (fp: string): boolean => {
  try {
    fs.statSync(fp);

    return true;
  } catch (error) {
    if ((error as { code?: string })?.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
};

export const createFile = async (
  filepath: string,
  filename: string,
  content: string,
  overwrite = false,
): Promise<void> => {
  const resolvedFilePath = path.join(filepath, filename);

  if (!overwrite && fileExists(resolvedFilePath)) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        message: `Conflict on file '${resolvedFilePath}', overwrite?`,
        name: 'overwrite',
        default: false,
        choices: [
          {
            key: 'y',
            name: 'Overwrite',
            value: 'overwrite',
          },
          {
            key: 'n',
            name: 'Cancel',
            value: 'cancel',
          },
        ],
      },
    ]);

    if (answers.overwrite) {
      await createFile(filepath, filename, content, true);
    }
    return;
  }

  fs.writeFileSync(path.join(filepath, filename), content);
};
export const createExportFile = async (
  filepath: string | string[],
  recursiveUntilPath = 'modules',
): Promise<void> => {
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

  await createFile(dir, 'index.ts', `${content}\n`, true);

  const newDir = path.join(dir, '..');

  if (basename !== recursiveUntilPath && newDir !== process.cwd()) {
    await createExportFile(newDir, recursiveUntilPath);
  }
};
