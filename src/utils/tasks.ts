import inquirer from 'inquirer';
import { table } from 'table';

import { mapSeries } from './map-series';

type TaskType = 'create-path' | 'create-file' | 'update' | 'delete';
type Task = [TaskType, string, () => void | Promise<void>];

const typesPrefix: Record<TaskType, string> = {
  'create-path': '🗂  Create directory:',
  'create-file': '🗃  Create file:',
  delete: '🗑  Delete:',
  update: '♻️  Update:',
};

export class Tasks {
  private tasks: Task[] = [];

  add(type: TaskType, description: string, execFn: () => void | Promise<void>) {
    this.tasks.push([type, description, execFn]);
  }

  getTasks() {
    return this.tasks;
  }

  async confirm(): Promise<boolean> {
    if (!this.tasks.length) return false;

    console.log(
      table(
        this.tasks.map(([type, message]) => [typesPrefix[type], message]),
        {
          drawVerticalLine: () => false,
          drawHorizontalLine: () => false,
        },
      ),
    );

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Confirm?',
      },
    ]);

    return answers.confirm;
  }

  async run(): Promise<boolean> {
    if (!(await this.confirm())) {
      return false;
    }

    await mapSeries(
      this.tasks.map(([, , fn]) => fn),
      (fn) => fn(),
    );

    return true;
  }

  static create() {
    return new Tasks();
  }
}
