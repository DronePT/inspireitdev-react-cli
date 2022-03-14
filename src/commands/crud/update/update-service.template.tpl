import { {{upperEntity}}Entity } from '../domain';
import { {{upperEntity}}Api } from '../utils';

export class Update{{upperEntity}}Service {
  static async update(id: any, data: Record<string, any>): Promise<{{upperEntity}}Entity> {
    const result = await {{upperEntity}}Api.create().put<{ data: any }>(`/${id}`, data);

    return {{upperEntity}}Entity.fromJson(result)
  }
}
