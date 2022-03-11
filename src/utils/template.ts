import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

Handlebars.registerHelper(
  'curly',
  (value: string, type: 'left' | 'right' | 'both' = 'both') => {
    const r = [];
    if (['left', 'both'].includes(type)) r.push('{');
    r.push(value);
    if (['right', 'both'].includes(type)) r.push('}');

    return r.join('');
  },
);

export const getFromTemplate = (
  templatePath: string[],
  context: Record<string, unknown>,
) => {
  const content = fs.readFileSync(path.join(...templatePath)).toString();

  const template = Handlebars.compile(content);
  return template(context);
};
