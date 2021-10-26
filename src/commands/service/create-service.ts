import { Command } from 'commander';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

export const createServiceAction =
  (program: Command) => (moduleName: string, serviceName: string) => {
    const servicePath = createDirectory([
      createModulePath(program, moduleName),
      'services',
    ]);

    const service = toHyphen(serviceName);

    createFile(
      servicePath,
      `${service}.service.ts`,
      getFromTemplate([__dirname, 'create-service.tpl'], {
        service: toCamelCase(service),
      }),
    );

    createExportFile(servicePath); // export service
  };
