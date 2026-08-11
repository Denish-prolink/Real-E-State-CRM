import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEmployeeApi } from '../api/employee.api';

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployeeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
