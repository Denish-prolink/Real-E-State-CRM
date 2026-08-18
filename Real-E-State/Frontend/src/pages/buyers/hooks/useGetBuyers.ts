import { useQuery } from '@tanstack/react-query';
import { getBuyers } from '../services/buyer.service';

export const useGetBuyers = (params: { page?: number; perPage?: number; search?: string } = {}, enabled = true) => {
  return useQuery({ queryKey: ['buyers', params], queryFn: () => getBuyers(params), enabled });
};
