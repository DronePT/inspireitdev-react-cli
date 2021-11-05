import { Command } from 'commander';
import path from 'path';

import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { getFromTemplate } from '../../utils/template';

export const createComponentAction = async (
  program: Command,
  moduleName: string,
  componentName: string,
  options: { customDirectory: boolean; force?: boolean },
) => {
  const component = toCamelCase(componentName, true);

  const modulePath = options.customDirectory
    ? createDirectory(moduleName.split('/'))
    : createModulePath(program, moduleName);

  const componentPath = createDirectory([modulePath, 'components', component]);

  await createFile(
    componentPath,
    `${component}.tsx`,
    getFromTemplate([__dirname, 'create-component.tpl'], { component }),
    options?.force === true,
  );

  await createExportFile(componentPath); // export file
};
