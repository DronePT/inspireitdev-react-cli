import plural from 'pluralize';
import { toCamelCase } from '../../../utils/camel-case';
import { createDirectory } from '../../../utils/directory';
import { createFile } from '../../../utils/file';
import { Tasks } from '../../../utils/tasks';
import { getFromTemplate } from '../../../utils/template';
import { toHyphen } from '../../../utils/to-hyphen';

export const createListService = (
  entity: string,
  modulePath: string,
  tasks: Tasks,
): string => {
  const entityPlural = plural(entity);

  const upperEntity = toCamelCase(entity);
  const lowerEntity = toCamelCase(entity, false);
  const upperEntityPlural = toCamelCase(entityPlural);
  const lowerEntityPlural = toCamelCase(entityPlural, false);

  const slugEntityPlural = toHyphen(entityPlural);

  const fileName = `list-${slugEntityPlural}`;
  const servicePath = createDirectory([modulePath, 'services']);

  if (!servicePath.exists)
    tasks.add('create-path', servicePath.data, servicePath.exec);

  const fileToCreate = createFile(
    servicePath.data,
    `${fileName}.service.ts`,
    getFromTemplate([__dirname, './list-service.template.tpl'], {
      upperEntity,
      lowerEntity,
      upperEntityPlural,
      lowerEntityPlural,
    }),
  );

  tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

  return servicePath.data;
};
