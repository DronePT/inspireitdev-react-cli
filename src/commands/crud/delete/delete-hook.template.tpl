import { Delete{{upperEntity}}Service } from '../services';

export const useDelete{{upperEntity}} = () => {
  return (id: any) => Delete{{upperEntity}}Service.delete(id);
};
