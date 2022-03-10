import { Entity } from '../../../core';

interface {{upperEntity}}State {
  id: number;
}

export class {{upperEntity}}Entity extends Entity<number, {{upperEntity}}State> {
  // Implement your domain entity logic here.

  static fromJson({{lowerEntity}}: any): any {
    return new {{upperEntity}}Entity({{lowerEntity}});
  }
}
