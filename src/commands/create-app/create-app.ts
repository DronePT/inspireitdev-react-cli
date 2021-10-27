import { Command } from 'commander';
import execSh from 'exec-sh';
import path from 'path';

import fs from 'fs';
import { toHyphen } from '../../utils/to-hyphen';

interface ExecError {
  stderr: string;
  stdout: string;
}

const createStepWrite = (total = 1) => {
  let count = 0;
  return (msg: string) => {
    count += 1;
    console.warn(`✅ ${msg} (${count}/${total})`);
  };
};

const replacePackageJsonScripts = (appDir: string) => {
  const packagePath = path.join(appDir, 'package.json');
  const packageJSON = JSON.parse(fs.readFileSync(packagePath).toString());
  packageJSON.scripts = {
    start: 'craco start',
    build: 'craco build',
    test: 'craco test',
    eject: 'react-scripts eject',
    cli: 'inspire-react',
  };

  fs.writeFileSync(packagePath, JSON.stringify(packageJSON, null, 2));
};

export const createAppAction =
  (program: Command) =>
  async (appName: string): Promise<void> => {
    const app = toHyphen(appName);

    const devDeps = [
      '@types/react-dom',
      'tailwindcss@npm:@tailwindcss/postcss7-compat',
      'postcss@^7',
      'autoprefixer@^9',
      '@inspireitdev/react-cli',
      '@types/react-router',
      '@types/recoil',
      '@types/react-router-dom',
    ];
    const prodDeps = [
      '@craco/craco',
      'clsx',
      'fast-deep-equal',
      'node-sass',
      'react-hook-form',
      'react-router-dom',
      'recoil',
    ];

    try {
      const templatePath = path.join(__dirname, '../../../template');
      const appDir = path.join(process.cwd(), app);
      const srcDir = path.join(appDir, 'src');
      const isWindows = process.platform === 'win32';

      console.warn('🏁 Creating app...');

      const steps = [
        {
          command: `npx create-react-app ${app} --template typescript`,
          message: 'create-react-app done!',
          cwd: process.cwd(),
        },
        {
          command: `yarn add --dev ${devDeps.join(' ')}`,
          message: 'Dev dependencies installed!',
          cwd: appDir,
        },
        {
          command: `yarn add ${prodDeps.join(' ')}`,
          message: 'Production dependencies installed!',
          cwd: appDir,
        },
        {
          command: isWindows ? `rmdir ${srcDir} /s /q` : `rm -rf ${srcDir}`,
          message: 'CRA default src/ directory removed!',
          cwd: appDir,
        },
        {
          command: isWindows
            ? `copy /y ${templatePath}/*  .`
            : `cp -Rf ${templatePath}/* .`,
          message: 'Boilerplate files copied to app folder!',
          cwd: appDir,
        },
      ];

      const stepWrite = createStepWrite(steps.length);

      // eslint-disable-next-line no-restricted-syntax
      for (const step of steps) {
        console.warn(`ℹ️  Executing: ${step.command}`);
        // eslint-disable-next-line no-await-in-loop
        await execSh.promise(step.command, { cwd: step.cwd, stdio: null });
        stepWrite(step.message);
      }

      replacePackageJsonScripts(app);

      console.log('Done! 🎉');
    } catch (e) {
      console.log('Error: ', e);
      console.log('Stderr: ', (e as ExecError).stderr);
      console.log('Stdout: ', (e as ExecError).stdout);
    }
  };
