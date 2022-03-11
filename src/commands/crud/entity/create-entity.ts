import { toCamelCase } from '../../../utils/camel-case';
import { createDirectory } from '../../../utils/directory';
import { createFile } from '../../../utils/file';
import { Tasks } from '../../../utils/tasks';
import { getFromTemplate } from '../../../utils/template';
import { toHyphen } from '../../../utils/to-hyphen';

export const createEntity = (
  entity: string,
  modulePath: string,
  tasks: Tasks,
): string => {
  const upperEntity = toCamelCase(entity);
  const lowerEntity = toCamelCase(entity, false);

  const slugEntity = toHyphen(entity);

  const entityPath = createDirectory([modulePath, 'domain']);

  if (!entityPath.exists)
    tasks.add('create-path', entityPath.data, entityPath.exec);

  const fileToCreate = createFile(
    entityPath.data,
    `${slugEntity}.entity.ts`,
    getFromTemplate([__dirname, './entity.tpl'], {
      upperEntity,
      lowerEntity,
    }),
  );

  if (fileToCreate.exists) return '';

  tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

  return entityPath.data;
};
