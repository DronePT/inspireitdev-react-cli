import plural from 'pluralize';
import { toCamelCase } from '../../../utils/camel-case';
import { createDirectory } from '../../../utils/directory';
import { createFile } from '../../../utils/file';
import { Tasks } from '../../../utils/tasks';
import { getFromTemplate } from '../../../utils/template';

export const createListPage = (
  entity: string,
  modulePath: string,
  tasks: Tasks,
): string => {
  const entityPlural = plural(entity);

  const upperEntity = toCamelCase(entity);
  const lowerEntity = toCamelCase(entity, false);
  const upperEntityPlural = toCamelCase(entityPlural);
  const lowerEntityPlural = toCamelCase(entityPlural, false);

  const pageName = `List${upperEntityPlural}Page`;
  const pagePath = createDirectory([modulePath, 'pages', pageName]);

  if (!pagePath.exists) tasks.add('create-path', pagePath.data, pagePath.exec);

  const fileToCreate = createFile(
    pagePath.data,
    `${pageName}.tsx`,
    getFromTemplate([__dirname, './list-page.template.tpl'], {
      upperEntity,
      lowerEntity,
      upperEntityPlural,
      lowerEntityPlural,
    }),
  );

  tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

  return pagePath.data;
};
