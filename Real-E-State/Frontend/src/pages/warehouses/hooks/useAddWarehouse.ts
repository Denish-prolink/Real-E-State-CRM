import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addWarehouseApi } from '../api/warehouse.api';

export const useAddWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addWarehouseApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });
};
