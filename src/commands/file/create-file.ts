import { Command } from 'commander';
import path from 'path';
import { createDirectory } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { toHyphen } from '../../utils/to-hyphen';

export const createFileAction =
  (program: Command) => (inputFilePath: string) => {
    const filePathDir = path.dirname(
      path.join(program.opts().destination, inputFilePath),
    );

    const filePath = createDirectory([filePathDir]);

    const ext = path.extname(inputFilePath);
    const filename = path.basename(inputFilePath, ext); // ?

    const newFileName = toHyphen(filename);

    createFile(filePath, `${newFileName}${ext}`, '\n');
  };
