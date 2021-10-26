import { Command } from 'commander';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { getFromTemplate } from '../../utils/template';

export const createPageAction =
  (program: Command) => (moduleName: string, pageName: string) => {
    const page = `${toCamelCase(pageName)}Page`;

    const pagePath = createDirectory([
      createModulePath(program, moduleName),
      'pages',
      page,
    ]);

    createFile(
      pagePath,
      `${page}.tsx`,
      getFromTemplate([__dirname, 'create-page.tpl'], { page }),
    );

    createExportFile(pagePath); // export file
  };
