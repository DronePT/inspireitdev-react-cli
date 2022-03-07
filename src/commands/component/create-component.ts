import { Command } from 'commander';
import path from 'path';

import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { Tasks } from '../../utils/tasks';
import { getFromTemplate } from '../../utils/template';

export const createComponentAction = async (
  program: Command,
  moduleName: string,
  componentName: string,
  options: { customDirectory: boolean; force?: boolean },
) => {
  const tasks = Tasks.create();

  const component = toCamelCase(componentName, true);

  const createModuleDirectory = options.customDirectory
    ? createDirectory(moduleName.split(path.sep))
    : createModulePath(program, moduleName);

  tasks.add(
    'create-path',
    createModuleDirectory.data,
    createModuleDirectory.exec,
  );

  const componentPath = createDirectory([
    createModuleDirectory.data,
    'components',
    component,
  ]);

  tasks.add('create-path', componentPath.data, componentPath.exec);

  const createComponent = createFile(
    componentPath.data,
    `${component}.tsx`,
    getFromTemplate([__dirname, 'create-component.tpl'], { component }),
    options?.force === true,
  );

  tasks.add('create-file', createComponent.data, createComponent.exec);

  if (await tasks.run()) {
    await createExportFile(
      componentPath.data,
      options.customDirectory ? 'components' : undefined,
    ); // export file
  }
};
