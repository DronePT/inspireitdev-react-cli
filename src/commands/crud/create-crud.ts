import inquirer from 'inquirer';
import plural from 'pluralize';
import { Command } from 'commander';

import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { Tasks } from '../../utils/tasks';
import { createExportFile, createFile } from '../../utils/file';
import { getFromTemplate } from '../../utils/template';
import { mapSeries } from '../../utils/map-series';

interface CreateCrudOptions {
  force?: boolean;
  pages: string[];
}

const getPageName = (page: string, entity: string): string =>
  ({
    create: `Create${entity}Page`,
    read: `View${entity}Page`,
    update: `Update${entity}Page`,
    delete: `Delete${entity}Page`,
    list: `List${plural(entity)}Page`,
  }[page] || '');

const createPageFiles = (
  page: string,
  entity: string,
  modulePath: string,
  tasks: Tasks,
): string => {
  const pageName = getPageName(page, entity);
  const pagePath = createDirectory([modulePath, 'pages', pageName]);

  if (!pagePath.exists) tasks.add('create-path', pagePath.data, pagePath.exec);

  const fileToCreate = createFile(
    pagePath.data,
    `${pageName}.tsx`,
    getFromTemplate([__dirname, '../page/create-page.tpl'], { page: pageName }),
  );

  tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

  return pagePath.data;
};

const getCreateCrudConfiguration = (
  entity: string,
  options: CreateCrudOptions,
) =>
  inquirer.prompt<CreateCrudOptions>(
    [
      {
        type: 'checkbox',
        name: 'pages',
        message: 'Choose the pages to create',
        choices: [
          { name: `Create${entity}Page`, value: 'create' },
          { name: `View${entity}Page`, value: 'read' },
          { name: `Update${entity}Page`, value: 'update' },
          { name: `Delete${entity}Page`, value: 'delete' },
          { name: `List${plural(entity)}Page`, value: 'list' },
        ],
      },
    ],
    options,
  );

export const createCrudAction =
  (program: Command) =>
  async (
    moduleName: string,
    entityName: string,
    options: CreateCrudOptions,
  ) => {
    const tasks = Tasks.create();

    const entity = toCamelCase(entityName);
    const config = await getCreateCrudConfiguration(entity, options);

    const modulePath = createModulePath(program, moduleName);

    if (!modulePath.exists)
      tasks.add('create-path', modulePath.data, modulePath.exec);

    const files = [
      ...config.pages.map((page) =>
        createPageFiles(page, entity, modulePath.data, tasks),
      ),
    ];

    if (await tasks.run()) {
      await mapSeries(files, (file) => createExportFile(file, 'pages'));
    }
  };
