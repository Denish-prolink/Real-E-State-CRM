import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWarehouseApi } from '../api/warehouse.api';

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWarehouseApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });
};
