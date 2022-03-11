/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import execSh from 'exec-sh';
import path from 'path';
import readline from 'readline';

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
  execute: boolean;
  commandFn?: () => Promise<void>;
  command: string;
  message: string;
  cwd: string;
}

interface CreateAppOptions {
  useNpm?: boolean;
  copyOnly?: boolean;
  useTailwind?: boolean;
  stateLib: StoreLibs;
}

const createStepWrite = (total = 1) => {
  let count = 0;
  return (msg: string) => {
    count += 1;
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    console.log(`✅ ${msg} (${count}/${total})`);
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

const startQuestions = (options: CreateAppOptions) =>
  inquirer.prompt<CreateAppOptions>(
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
      {
        name: 'useTailwind',
        type: 'confirm',
        message: 'Use TailwindCSS?',
        default: true,
      },
    ],
    options,
  );

export const createAppAction = async (
  appName: string,
  options: CreateAppOptions,
): Promise<void> => {
  const answers = await startQuestions(options);
  const { copyOnly, useNpm, useTailwind, stateLib } = answers;

  const app = toHyphen(appName);

  const devDeps = [
    '@types/react-dom',
    '@inspireitdev/react-cli',
    '@types/react-router',
  ];

  const prodDeps = [
    'clsx',
    'fast-deep-equal',
    'node-sass',
    'react-hook-form',
    'react-router-dom@6',
    'axios',
  ];

  if (useTailwind) {
    devDeps.push('tailwindcss');
    devDeps.push('postcss');
    devDeps.push('autoprefixer');
  }

  switch (stateLib) {
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

      console.log(`🗑  Removing ${appDir}`);

      await fsExtra.remove(appDir);
    }

    console.log('🏁 Creating app...');

    const stepsConfiguration: ShellCommand[] = [
      {
        execute: !copyOnly,
        command: `npx create-react-app ${app}${
          useNpm ? ' --use-mpm' : ''
        } --template typescript`,
        message: 'create-react-app done!',
        cwd: process.cwd(),
      },
      {
        execute: !copyOnly,
        command: `${
          useNpm ? 'npm install --save-dev' : 'yarn add --dev'
        } ${devDeps.join(' ')}`,
        message: 'Dev dependencies installed!',
        cwd: appDir,
      },
      {
        execute: !copyOnly,
        command: `${useNpm ? 'npm install' : 'yarn add'} ${prodDeps.join(' ')}`,
        message: 'Production dependencies installed!',
        cwd: appDir,
      },
      {
        execute: true,
        commandFn: () => fsExtra.remove(srcDir),
        command: 'Removing CRA default src/ directory.',
        message: 'CRA default src/ directory removed!',
        cwd: appDir,
      },
      {
        execute: true,
        commandFn: () =>
          fsExtra.copy(templatePath, appDir, {
            overwrite: true,
            filter: (filepath) => {
              if (stateLib === 'none' && filepath.includes('src/store'))
                return false;

              if (!useTailwind && filepath.includes('tailwind.config.js'))
                return false;

              return true;
            },
          }),
        command: 'Copying InspireIT React template files.',
        message: 'InspireIT React files copied to app folder!',
        cwd: appDir,
      },
      {
        execute: stateLib === 'none',
        commandFn: async () => {
          const indexPath = path.join(appDir, 'src/index.tsx');
          // import '\.\/store';\n
          const data = (await fsExtra.readFile(indexPath))
            .toString()
            .replace(/import '\.\/store';\n/gi, '');

          return fsExtra.writeFile(indexPath, data);
        },
        command: `Removing "import './store';" from src/index.tsx`,
        message: `"import './store';" removed from src/index.tsx`,
        cwd: appDir,
      },
      {
        execute: !!useTailwind,
        command: 'npx tailwindcss init',
        message: 'Initializing TailwindCSS!',
        cwd: appDir,
      },
      {
        execute: true,
        commandFn: () =>
          fsExtra.writeJson(path.join(appDir, 'inspire-react.json'), answers, {
            spaces: 2,
          }),
        command: 'Creating inspire-react.json file.',
        message: 'inspire-react.json created!',
        cwd: appDir,
      },
      {
        execute: !copyOnly,
        commandFn: async () => replacePackageJsonScripts(app),
        command: 'Configuring package.json',
        message: 'package.json configured!',
        cwd: appDir,
      },
    ];

    const steps = stepsConfiguration.filter((step) => step.execute);

    const stepWrite = createStepWrite(steps.length);

    for (const step of steps) {
      process.stdout.write(`ℹ️  Executing: ${step.command}`);

      if (!step.commandFn && step.command) {
        await execSh.promise(step.command, { cwd: step.cwd, stdio: null });
      }

      if (step.commandFn) await step.commandFn();

      stepWrite(step.message);
    }

    console.log('Done! 🎉');
  } catch (e) {
    console.log('Error: ', e);
    console.log('Stderr: ', (e as ExecError).stderr);
    console.log('Stdout: ', (e as ExecError).stdout);
  }
};
