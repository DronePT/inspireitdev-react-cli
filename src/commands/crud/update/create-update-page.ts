import { toCamelCase } from '../../../utils/camel-case';
import { createDirectory } from '../../../utils/directory';
import { createFile } from '../../../utils/file';
import { Tasks } from '../../../utils/tasks';
import { getFromTemplate } from '../../../utils/template';

export const createUpdatePage = (
  entity: string,
  modulePath: string,
  tasks: Tasks,
): string => {
  const upperEntity = toCamelCase(entity);
  const lowerEntity = toCamelCase(entity, false);

  const pageName = `Update${upperEntity}Page`;
  const pagePath = createDirectory([modulePath, 'pages', pageName]);

  if (!pagePath.exists) tasks.add('create-path', pagePath.data, pagePath.exec);

  const fileToCreate = createFile(
    pagePath.data,
    `${pageName}.tsx`,
    getFromTemplate([__dirname, './update-page.template.tpl'], {
      upperEntity,
      lowerEntity,
    }),
  );

  tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

  return pagePath.data;
};
