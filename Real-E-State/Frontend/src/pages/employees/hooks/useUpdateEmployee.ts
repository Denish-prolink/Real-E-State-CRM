import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmployeeApi } from '../api/employee.api';

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployeeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
