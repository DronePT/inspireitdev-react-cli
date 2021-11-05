import { Command } from 'commander';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { Tasks } from '../../utils/tasks';
import { getFromTemplate } from '../../utils/template';

export const createPageAction =
  (program: Command) =>
  async (moduleName: string, pageName: string, options: any) => {
    const opts = {
      ...program.opts<{ destination: string }>(),
      ...options,
      customDirectory: moduleName.includes('/'),
    };

    const tasks = Tasks.create();

    const modulePath = opts.customDirectory
      ? createDirectory(moduleName.split('/'))
      : createModulePath(program, moduleName);

    tasks.add('create-path', modulePath.data, modulePath.exec);

    const page = `${toCamelCase(pageName)}Page`;

    const pagePath = createDirectory([modulePath.data, 'pages', page]);

    tasks.add('create-path', pagePath.data, pagePath.exec);

    const fileToCreate = createFile(
      pagePath.data,
      `${page}.tsx`,
      getFromTemplate([__dirname, 'create-page.tpl'], { page }),
      options?.force === true,
    );

    tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

    if (await tasks.run()) {
      await createExportFile(pagePath.data); // export file
    }
  };
