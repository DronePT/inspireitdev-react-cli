import { Command } from 'commander';
import inquirer from 'inquirer';
import { toCamelCase } from '../../utils/camel-case';
import { createDirectory, createModulePath } from '../../utils/directory';
import { createExportFile, createFile } from '../../utils/file';
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
    options: any,
  ) => {
    const domainPath = createDirectory([
      createModulePath(program, moduleName),
      'domain',
    ]);

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

    await createFile(
      domainPath,
      `${name}.${type}.ts`,
      getFromTemplate([__dirname, template], {
        domain: toCamelCase(name),
        type: typeCamelCase,
      }),
      options?.force === true,
    );

    await createExportFile(domainPath); // export domain
  };
