import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api/axios';

export interface SiteVisitData {
  _id?: string;
  leadId: string;
  propertyId?: string;
  agentId?: string;
  visitDate: string;
  status?: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'No Show';
  feedback?: string;
  rating?: number;
  notes?: string;
}

export const useSiteVisits = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['site-visits', filters],
    queryFn: async () => {
      const response = await api.get('/site-visits', { params: filters });
      return response.data.data;
    },
  });
};

export const useCreateSiteVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (visitData: SiteVisitData) => {
      const response = await api.post('/site-visits', visitData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-visits'] });
    },
  });
};
