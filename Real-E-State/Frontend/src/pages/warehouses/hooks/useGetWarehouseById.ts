import { useQuery } from '@tanstack/react-query';
import { getWarehouseByIdApi } from '../api/warehouse.api';

export const useGetWarehouseById = (id: string | null) => {
  return useQuery({
    queryKey: ['warehouses', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await getWarehouseByIdApi(id);
      return response.data;
    },
    enabled: !!id,
  });
};
