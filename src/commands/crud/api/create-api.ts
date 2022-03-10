import plural from 'pluralize';
import { toCamelCase } from '../../../utils/camel-case';
import { createDirectory } from '../../../utils/directory';
import { createFile } from '../../../utils/file';
import { Tasks } from '../../../utils/tasks';
import { getFromTemplate } from '../../../utils/template';
import { toHyphen } from '../../../utils/to-hyphen';

export const createApi = (
  entity: string,
  modulePath: string,
  tasks: Tasks,
): string => {
  const upperEntity = toCamelCase(entity);
  const lowerEntity = toCamelCase(entity, false);

  const slugEntity = toHyphen(entity);
  const slugEntityPlural = toHyphen(plural(entity));

  const utilsPath = createDirectory([modulePath, 'utils']);

  if (!utilsPath.exists)
    tasks.add('create-path', utilsPath.data, utilsPath.exec);

  const fileToCreate = createFile(
    utilsPath.data,
    `${slugEntity}-api.util.ts`,
    getFromTemplate([__dirname, './api.tpl'], {
      upperEntity,
      lowerEntity,
      slugEntity,
      slugEntityPlural,
    }),
  );

  tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

  return utilsPath.data;
};
