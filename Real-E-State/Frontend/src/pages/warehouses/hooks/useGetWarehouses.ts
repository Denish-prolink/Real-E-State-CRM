import { useQuery } from '@tanstack/react-query';
import { getWarehousesApi } from '../api/warehouse.api';

export const useGetWarehouses = (search?: string) => {
  return useQuery({
    queryKey: ['warehouses', search],
    queryFn: async () => {
      const response = await getWarehousesApi(search);
      return response.data;
    },
  });
};
