import { Command } from 'commander';
import execSh from 'exec-sh';
import path from 'path';

import { toHyphen } from '../../utils/to-hyphen';

interface ExecError {
  stderr: string;
  stdout: string;
}

export const createAppAction =
  (program: Command) =>
  async (appName: string): Promise<void> => {
    let out: ExecError = { stderr: '', stdout: '' };
    const app = toHyphen(appName);

    const devDeps = [
      'tailwindcss@npm:@tailwindcss/postcss7-compat',
      'postcss@^7',
      'autoprefixer@^9',
      '@inspireitdev/react-cli',
      '@types/react-router',
      '@types/recoil',
    ];
    const prodDeps = [
      '@craco/craco',
      'clsx',
      'fast-deep-equal',
      'node-sass',
      'react-router-dom',
      'recoil',
    ];

    try {
      const boilerplatePath = path.join(__dirname, '../../../boilerplate');

      out = await execSh.promise(
        `create-react-app ${app} --template typescript && \
        cd ${app} && \
        rm -rf src && \
        yarn add --dev ${devDeps.join(' ')} && \
        yarn add ${prodDeps.join(' ')} && \
        cp -R ${boilerplatePath}/* .`,
        true,
      );

      console.log('Done! 🎉');
    } catch (e) {
      console.log('Error: ', e);
      console.log('Stderr: ', (e as ExecError).stderr);
      console.log('Stdout: ', (e as ExecError).stdout);
    }
  };
