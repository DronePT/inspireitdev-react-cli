import { useState, useEffect } from 'react';
import { {{upperEntity}}Entity } from '../domain';
import { List{{upperEntityPlural}}Service } from '../services';

export const useList{{upperEntityPlural}} = () => {
  const [{{lowerEntityPlural}}, set{{upperEntityPlural}}] = useState<{{upperEntity}}Entity[]>([]);

  useEffect(() => {
    List{{upperEntityPlural}}Service.get().then((data) => set{{upperEntityPlural}}(data));
  }, []);

  return { {{lowerEntityPlural}} };
};
