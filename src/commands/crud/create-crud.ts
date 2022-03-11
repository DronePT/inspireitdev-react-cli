import inquirer from 'inquirer';
import plural from 'pluralize';
import { Command } from 'commander';

import { toCamelCase } from '../../utils/camel-case';
import { createModulePath } from '../../utils/directory';
import { Tasks } from '../../utils/tasks';
import { createExportFile } from '../../utils/file';
import { mapSeries } from '../../utils/map-series';

import { createListPage } from './list/create-list-page';
import { createListHook } from './list/create-list-hook';
import { createListService } from './list/create-list-service';
import { createEntity } from './entity/create-entity';
import { createApi } from './api/create-api';
import { createReadPage } from './read/create-read-page';
import { createReadService } from './read/create-read-service';
import { createReadHook } from './read/create-read-hook';

type PageType = 'create' | 'read' | 'update' | 'delete' | 'list';

interface CreateCrudOptions {
  force?: boolean;
  pages: PageType[];
}

const createPageFiles = (
  page: PageType,
  entity: string,
  modulePath: string,
  tasks: Tasks,
): string[] => {
  switch (page) {
    case 'list':
      return [
        createListPage(entity, modulePath, tasks),
        createListService(entity, modulePath, tasks),
        createListHook(entity, modulePath, tasks),
      ];
    case 'read':
      return [
        createReadPage(entity, modulePath, tasks),
        createReadService(entity, modulePath, tasks),
        createReadHook(entity, modulePath, tasks),
      ];
    default:
      return [];
  }
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
      createEntity(entity, modulePath.data, tasks),
      createApi(entity, modulePath.data, tasks),
      ...config.pages
        .map((page) => createPageFiles(page, entity, modulePath.data, tasks))
        .flat(),
    ].filter((f) => f !== '');

    if (await tasks.run()) {
      await mapSeries(files, (file) => createExportFile(file, 'modules'));
    }
  };
