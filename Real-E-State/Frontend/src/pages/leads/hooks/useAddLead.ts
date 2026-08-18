import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addLeadApi } from '../api/lead.api';

export const useAddLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addLeadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
