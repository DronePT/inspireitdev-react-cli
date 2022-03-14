import { {{upperEntity}}Api } from '../utils';

export class Delete{{upperEntity}}Service {
  static async delete(id: any): Promise<void> {
    await {{upperEntity}}Api.create().delete<{ data: any }>(`/${id}`);
  }
}
