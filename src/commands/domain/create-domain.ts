import { Command } from 'commander';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

export const createDomainAction =
  (program: Command) =>
  async (
    moduleName: string,
    domainName: string,
    domainType: string,
    options: any,
  ) => {
    const domainPath = createDirectory([
      createModulePath(program, moduleName),
      'domain',
    ]);

    const name = toHyphen(domainName);
    const type = toHyphen(domainType);

    await createFile(
      domainPath,
      `${name}.${type}.ts`,
      getFromTemplate([__dirname, 'create-domain.tpl'], {
        domain: toCamelCase(name),
        type: toCamelCase(type),
      }),
      options?.force === true,
    );

    await createExportFile(domainPath); // export domain
  };
