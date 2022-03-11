import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { {{upperEntity}}Entity } from '../domain';
import { Get{{upperEntity}}Service } from '../services';

export const useGet{{upperEntity}} = () => {
  const [{{lowerEntity}}, set{{upperEntity}}] = useState<{{upperEntity}}Entity>();
  const { id } = useParams();

  useEffect(() => {
    Get{{upperEntity}}Service.get(id).then((data) => set{{upperEntity}}(data));
  }, [id]);

  return { id, {{lowerEntity}} };
};
