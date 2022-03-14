import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { {{upperEntity}}Entity } from '../domain';
import {
  Update{{upperEntity}}Service,
  Get{{upperEntity}}Service
} from '../services';

export const useUpdate{{upperEntity}} = () => {
  const [{{lowerEntity}}, set{{upperEntity}}] = useState<{{upperEntity}}Entity>();
  const { id } = useParams();

  useEffect(() => {
    Get{{upperEntity}}Service.get(id).then((data) => set{{upperEntity}}(data));
  }, [id]);

  const update = async (data: any) => {
    const {{lowerEntity}} = await Update{{upperEntity}}Service.update(id, data)
    set{{upperEntity}}({{lowerEntity}});
  }

  return { id, {{lowerEntity}}, update };
};
