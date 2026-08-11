import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWarehouseApi } from '../api/warehouse.api';

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWarehouseApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });
};
