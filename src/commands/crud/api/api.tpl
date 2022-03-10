import { HttpClient } from '../../../core';

export class {{upperEntity}}Api extends HttpClient {
  constructor() {
    super('{{slugEntityPlural}}');
  }

  static create() {
    return new {{upperEntity}}Api();
  }
}
