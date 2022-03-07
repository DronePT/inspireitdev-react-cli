/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import execSh from 'exec-sh';
import path from 'path';

import fs from 'fs';
import fsExtra from 'fs-extra';
import inquirer from 'inquirer';
import { toHyphen } from '../../utils/to-hyphen';
import { StoreLibs } from '../store/create-store';

interface ExecError {
  stderr: string;
  stdout: string;
}

interface ShellCommand {
  commandFn?: () => Promise<void>;
  command: string;
  message: string;
  cwd: string;
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
    ...packageJSON.scripts,
    cli: 'inspire-react',
  };

  fs.writeFileSync(packagePath, JSON.stringify(packageJSON, null, 2));
};

export const createAppAction = async (
  appName: string,
  options: { useNpm?: boolean; copyOnly?: boolean; stateLib: StoreLibs },
): Promise<void> => {
  const answers = await inquirer.prompt<{
    useNpm?: boolean;
    copyOnly?: boolean;
    stateLib: StoreLibs;
  }>(
    [
      {
        type: 'list',
        name: 'useNpm',
        message: 'Choose a package manager',
        choices: [
          { checked: true, name: 'Yarn', value: false },
          { checked: false, name: 'NPM', value: true },
        ],
      },
      {
        type: 'list',
        name: 'stateLib',
        message: 'Choose state library',
        choices: [
          { checked: true, name: 'Zustand', value: 'zustand' },
          { checked: false, name: 'Recoil', value: 'recoil' },
          { checked: false, name: 'Redux', value: 'redux', disabled: true },
          { checked: false, name: 'None', value: 'none' },
        ],
      },
    ],
    options,
  );

  const app = toHyphen(appName);

  const devDeps = [
    '@types/react-dom',
    'tailwindcss',
    'postcss',
    'autoprefixer',
    '@inspireitdev/react-cli',
    '@types/react-router',
  ];

  const prodDeps = [
    'clsx',
    'fast-deep-equal',
    'node-sass',
    'react-hook-form',
    'react-router-dom@6',
  ];

  switch (answers.stateLib) {
    case 'recoil':
      prodDeps.push('recoil');
      devDeps.push('@types/recoil');
      break;
    case 'zustand':
      prodDeps.push('zustand');
      break;
    default:
      break;
  }

  try {
    const templatePath = path.join(__dirname, '../../../template');
    const appDir = path.join(process.cwd(), app);
    const srcDir = path.join(appDir, 'src');

    if (!options.copyOnly && (await fsExtra.pathExists(appDir))) {
      const overwriteAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          message: `'${appDir}' already exists, overwrite it?`,
          name: 'overwrite',
          default: false,
          choices: [
            {
              key: 'y',
              name: 'Overwrite',
              value: 'overwrite',
            },
            {
              key: 'n',
              name: 'Cancel',
              value: 'cancel',
            },
          ],
        },
      ]);

      if (!overwriteAnswer.overwrite) return;

      console.warn(`🗑  Removing ${appDir}`);

      await fsExtra.remove(appDir);
    }

    console.warn('🏁 Creating app...');
    const copyTemplateCommands = [
      {
        commandFn: () => fsExtra.remove(srcDir),
        command: 'Removing CRA default src/ directory.',
        message: 'CRA default src/ directory removed!',
        cwd: appDir,
      },
      {
        commandFn: () =>
          fsExtra.copy(templatePath, appDir, {
            overwrite: true,
            filter: (filepath) => {
              if (answers.stateLib === 'zustand') return true;

              return !filepath.includes('src/store');
            },
          }),
        command: 'Copying InspireIT React template files.',
        message: 'InspireIT React files copied to app folder!',
        cwd: appDir,
      },
      {
        command: 'npx tailwindcss init',
        message: 'Initializing TailwindCSS!',
        cwd: appDir,
      },
    ];

    const { copyOnly, useNpm } = options;

    const steps: ShellCommand[] = copyOnly
      ? copyTemplateCommands
      : [
          {
            command: `npx create-react-app ${app}${
              useNpm ? ' --use-mpm' : ''
            } --template typescript`,
            message: 'create-react-app done!',
            cwd: process.cwd(),
          },
          {
            command: `${
              useNpm ? 'npm install --save-dev' : 'yarn add --dev'
            } ${devDeps.join(' ')}`,
            message: 'Dev dependencies installed!',
            cwd: appDir,
          },
          {
            command: `${useNpm ? 'npm install' : 'yarn add'} ${prodDeps.join(
              ' ',
            )}`,
            message: 'Production dependencies installed!',
            cwd: appDir,
          },
          ...copyTemplateCommands,
        ];

    const stepWrite = createStepWrite(steps.length);

    for (const step of steps) {
      console.warn(`ℹ️  Executing: ${step.command}`);

      if (!step.commandFn && step.command) {
        await execSh.promise(step.command, { cwd: step.cwd, stdio: null });
      }

      if (step.commandFn) await step.commandFn();

      stepWrite(step.message);
    }

    if (!copyOnly) replacePackageJsonScripts(app);

    console.log('Done! 🎉');
  } catch (e) {
    console.log('Error: ', e);
    console.log('Stderr: ', (e as ExecError).stderr);
    console.log('Stdout: ', (e as ExecError).stdout);
  }
};
