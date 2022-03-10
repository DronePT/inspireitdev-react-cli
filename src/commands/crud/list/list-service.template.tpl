import { {{upperEntity}}Entity } from '../domain';
import { {{upperEntity}}Api } from '../utils';

export class List{{upperEntityPlural}}Service {
  static async get(): Promise<{{upperEntity}}Entity[]> {
    const result = await {{upperEntity}}Api.create().get<{ data: any[] }>('');

    return result.data.map(({{lowerEntity}}) => {{upperEntity}}Entity.fromJson({{lowerEntity}}));
  }
}
