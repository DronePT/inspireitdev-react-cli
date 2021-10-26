import { Command } from 'commander';
import { createDomainAction } from './create-domain';

export const install = (program: Command) => {
  program
    .command('domain')
    .argument('<module>', 'Module name.')
    .argument(
      '<domain-name>',
      'Name of the file for this domain/business logic.',
    )
    .argument(
      '[domain-type]',
      'What type of domain logic it belongs. (Eg.: Entity, Model, Value Objects, etc...)',
    )
    .option('-f --force', 'Overwrite any existing file.')
    .action(createDomainAction(program));
};
