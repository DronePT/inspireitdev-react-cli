import { {{upperEntity}}Entity } from '../domain';
import { {{upperEntity}}Api } from '../utils';

export class Get{{upperEntity}}Service {
  static async get(id: any): Promise<{{upperEntity}}Entity> {
    const result = await {{upperEntity}}Api.create().get<{ data: any }>(`/${id}`);

    return {{upperEntity}}Entity.fromJson(result)
  }
}
