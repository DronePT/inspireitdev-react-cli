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

export const createFile = (
  filepath: string,
  filename: string,
  content: string,
  overwrite = false,
) => {
  const resolvedFilePath = path.join(filepath, filename);
  const exists = fileExists(resolvedFilePath);

  const exec = async (ow = overwrite) => {
    if (!ow && exists) {
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
        await exec(true);
      }
      return;
    }

    fs.writeFileSync(resolvedFilePath, content);
  };

  return {
    exists,
    data: resolvedFilePath,
    exec,
  };
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
    .filter((f) => f.indexOf('index') < 0 && f !== 'assets')
    .map((f) => {
      const isDir = fs.statSync(path.join(dir, f)).isDirectory();
      const fd = path.basename(f, path.extname(f));

      return {
        isDir,
        value: `export * from './${fd}';`,
      };
    });

  const content = filesAndDirs.map((f) => f.value).join('\n');

  await createFile(dir, 'index.ts', `${content}\n`, true).exec();

  const newDir = path.join(dir, '..');

  if (basename !== recursiveUntilPath && newDir !== process.cwd()) {
    await createExportFile(newDir, recursiveUntilPath);
  }
};
