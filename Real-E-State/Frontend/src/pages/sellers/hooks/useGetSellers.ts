import { useQuery } from '@tanstack/react-query';
import { getSellers } from '../services/seller.service';

export const useGetSellers = (params: { page?: number; perPage?: number; search?: string } = {}, enabled = true) => {
  return useQuery({ queryKey: ['sellers', params], queryFn: () => getSellers(params), enabled });
};
