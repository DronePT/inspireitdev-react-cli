import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export const getFromTemplate = (
  templatePath: string[],
  context: Record<string, unknown>,
) => {
  const content = fs.readFileSync(path.join(...templatePath)).toString();

  const template = Handlebars.compile(content);
  return template(context);
};
