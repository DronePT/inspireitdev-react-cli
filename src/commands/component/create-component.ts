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
  otherDir: string,
  options: any,
) => {
  const component = toCamelCase(componentName, true);

  let modulePath = createModulePath(program, moduleName);

  if (otherDir) {
    modulePath = path.join(modulePath, otherDir);
  }

  const componentPath = createDirectory([modulePath, 'components', component]);

  await createFile(
    componentPath,
    `${component}.tsx`,
    getFromTemplate([__dirname, 'create-component.tpl'], { component }),
    options?.force === true,
  );

  await createExportFile(componentPath); // export file
};
