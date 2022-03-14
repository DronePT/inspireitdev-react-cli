import plural from 'pluralize';
import { toCamelCase } from '../../../utils/camel-case';
import { createDirectory } from '../../../utils/directory';
import { createFile } from '../../../utils/file';
import { Tasks } from '../../../utils/tasks';
import { getFromTemplate } from '../../../utils/template';
import { toHyphen } from '../../../utils/to-hyphen';

export const createUpdateHook = (
  entity: string,
  modulePath: string,
  tasks: Tasks,
): string => {
  const entityPlural = plural(entity);

  const upperEntity = toCamelCase(entity);
  const lowerEntity = toCamelCase(entity, false);
  const upperEntityPlural = toCamelCase(entityPlural);
  const lowerEntityPlural = toCamelCase(entityPlural, false);

  const slugEntity = toHyphen(entity);

  const fileName = `use-update-${slugEntity}`;
  const hookPath = createDirectory([modulePath, 'hooks']);

  if (!hookPath.exists) tasks.add('create-path', hookPath.data, hookPath.exec);

  const fileToCreate = createFile(
    hookPath.data,
    `${fileName}.hook.ts`,
    getFromTemplate([__dirname, './update-hook.template.tpl'], {
      upperEntity,
      lowerEntity,
      upperEntityPlural,
      lowerEntityPlural,
    }),
  );

  tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

  return hookPath.data;
};
