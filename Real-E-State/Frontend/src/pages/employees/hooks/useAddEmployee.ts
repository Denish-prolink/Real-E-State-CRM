import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addEmployeeApi } from '../api/employee.api';

export const useAddEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEmployeeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
