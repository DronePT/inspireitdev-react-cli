import { Command } from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
import { Tasks } from '../../utils/tasks';
import { getFromTemplate } from '../../utils/template';
import { toHyphen } from '../../utils/to-hyphen';

const templates: Record<string, string> = {
  entity: 'create-domain-entity.tpl',
  valueobject: 'create-domain-value-object.tpl',
};

export const createDomainAction =
  (program: Command) =>
  async (
    moduleName: string,
    domainName: string,
    domainType: string,
    options: { force?: boolean },
  ) => {
    const opts = {
      ...program.opts<{ destination: string }>(),
      ...options,
      customDirectory: moduleName.includes(path.sep),
    };

    const tasks = Tasks.create();

    const modulePath = opts.customDirectory
      ? createDirectory(moduleName.split(path.sep))
      : createModulePath(program, moduleName);

    tasks.add('create-path', modulePath.data, modulePath.exec);

    const domainPath = createDirectory([modulePath.data, 'domain']);

    tasks.add('create-path', domainPath.data, domainPath.exec);

    let answers = await inquirer.prompt<{ type: string }>(
      [
        {
          type: 'list',
          name: 'type',
          message: 'Domain Type',
          choices: [
            { checked: true, name: 'Entity', value: 'entity' },
            { checked: false, name: 'Value Object', value: 'value-object' },
            { checked: false, name: 'Other', value: null },
          ],
        },
      ],
      { type: domainType },
    );

    if (!answers.type) {
      answers = await inquirer.prompt({
        type: 'input',
        name: 'type',
        message: 'Other',
        suffix: ':',
      });
    }

    const name = toHyphen(domainName);
    const type = toHyphen(answers.type);
    const typeCamelCase = toCamelCase(type);

    const template =
      templates[typeCamelCase.toLowerCase()] || 'create-domain.tpl';

    const fileToCreate = createFile(
      domainPath.data,
      `${name}.${type}.ts`,
      getFromTemplate([__dirname, template], {
        domain: toCamelCase(name),
        type: typeCamelCase,
      }),
      opts?.force === true,
    );

    tasks.add('create-file', fileToCreate.data, fileToCreate.exec);

    if (await tasks.run()) {
      await createExportFile(domainPath.data); // export domain
    }
  };
