import { useQuery } from '@tanstack/react-query';
import { getEmployeesApi } from '../api/employee.api';

export const useGetEmployees = (search?: string) => {
  return useQuery({
    queryKey: ['employees', search],
    queryFn: async () => {
      const response = await getEmployeesApi(search);
      return response.data;
    },
  });
};
