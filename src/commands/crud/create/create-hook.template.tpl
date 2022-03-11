import { useState } from 'react';

import { {{upperEntity}}Entity } from '../domain';
import { Create{{upperEntity}}Service } from '../services';

export const useCreate{{upperEntity}} = () => {
  const [{{lowerEntity}}, set{{upperEntity}}] = useState<{{upperEntity}}Entity>();

  const create = async (data: any) => {
    const {{lowerEntity}} = await Create{{upperEntity}}Service.create(data)
    set{{upperEntity}}({{lowerEntity}});
  }

  return { {{lowerEntity}}, create };
};
