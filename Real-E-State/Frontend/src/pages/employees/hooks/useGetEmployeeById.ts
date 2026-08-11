import { useQuery } from '@tanstack/react-query';
import { getEmployeeByIdApi } from '../api/employee.api';

export const useGetEmployeeById = (id: string, options = {}) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const response = await getEmployeeByIdApi(id);
      return response.data;
    },
    ...options,
  });
};
