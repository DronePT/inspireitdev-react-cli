import { toCamelCase } from '../../utils/camel-case';
import { createDirectory } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { Tasks } from '../../utils/tasks';
import { getFromTemplate } from '../../utils/template';

interface CreateSharedComponentOptions {
  force?: boolean;
  destination: string;
  customDirectory?: boolean;
}

export const createSharedComponent = async (
  componentOrModule: string,
  options: CreateSharedComponentOptions,
): Promise<void> => {
  const tasks = Tasks.create();

  const component = toCamelCase(componentOrModule);

  const componentPath = createDirectory([
    options.destination,
    'components',
    component,
  ]);

  tasks.add('create-path', componentPath.data, componentPath.exec);

  const createdFile = createFile(
    componentPath.data,
    `${component}.tsx`,
    getFromTemplate([__dirname, 'create-component.tpl'], { component }),
    options?.force === true,
  );

  tasks.add('create-file', createdFile.data, createdFile.exec);

  if (await tasks.run()) {
    await createExportFile(componentPath.data, 'components'); // export file
  }
};
