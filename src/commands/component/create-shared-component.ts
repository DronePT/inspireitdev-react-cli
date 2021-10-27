import { toCamelCase } from '../../utils/camel-case';
import { createDirectory } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { getFromTemplate } from '../../utils/template';

interface CreateSharedComponentOptions {
  force?: boolean;
  destination: string;
}

export const createSharedComponent = async (
  componentOrModule: string,
  options: CreateSharedComponentOptions,
): Promise<void> => {
  const component = toCamelCase(componentOrModule);

  const componentPath = createDirectory([
    options.destination,
    'components',
    component,
  ]);

  await createFile(
    componentPath,
    `${component}.tsx`,
    getFromTemplate([__dirname, 'create-component.tpl'], { component }),
    options?.force === true,
  );

  await createExportFile(componentPath, 'components'); // export file
};
