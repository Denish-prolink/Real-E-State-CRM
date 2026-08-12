import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api/axios';

export interface DealData {
  _id?: string;
  dealNumber?: string;
  leadId: string;
  propertyId?: string;
  agentId?: string;
  dealValue: number;
  discount?: number;
  expectedClosingDate?: string;
  stage?: 'New' | 'Qualified' | 'Site Visit' | 'Negotiation' | 'Booking' | 'Won' | 'Lost';
  probability?: number;
  notes?: string;
}

export const useDeals = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['deals', filters],
    queryFn: async () => {
      const response = await api.get('/deals', { params: filters });
      return response.data.data;
    },
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dealData: DealData) => {
      const response = await api.post('/deals', dealData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dealData }: { id: string; dealData: Partial<DealData> }) => {
      const response = await api.put(`/deals/${id}`, dealData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
};
