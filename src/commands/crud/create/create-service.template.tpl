import { {{upperEntity}}Entity } from '../domain';
import { {{upperEntity}}Api } from '../utils';

export class Create{{upperEntity}}Service {
  static async create(data: any): Promise<{{upperEntity}}Entity> {
    const result = await {{upperEntity}}Api.create().post<{ data: any }>('', data);

    return {{upperEntity}}Entity.fromJson(result)
  }
}
