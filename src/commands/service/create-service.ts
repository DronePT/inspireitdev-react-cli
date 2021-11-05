import { Command } from 'commander';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { Tasks } from '../../utils/tasks';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

export const createServiceAction =
  (program: Command) =>
  async (
    moduleName: string,
    serviceName: string,
    options: { force?: boolean },
  ) => {
    const opts = {
      ...program.opts<{ destination: string }>(),
      ...options,
      customDirectory: moduleName.includes('/'),
    };

    const tasks = Tasks.create();

    const modulePath = opts.customDirectory
      ? createDirectory(moduleName.split('/'))
      : createModulePath(program, moduleName);

    tasks.add('create-path', modulePath.data, modulePath.exec);

    const servicePath = createDirectory([modulePath.data, 'services']);

    tasks.add('create-path', servicePath.data, servicePath.exec);

    const service = toHyphen(serviceName);

    const fileToCreate = createFile(
      servicePath.data,
      `${service}.service.ts`,
      getFromTemplate([__dirname, 'create-service.tpl'], {
        service: toCamelCase(service),
      }),
      opts?.force === true,
    );

    tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

    if (await tasks.run()) {
      await createExportFile(servicePath.data); // export service
    }
  };
