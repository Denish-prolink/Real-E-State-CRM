import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteContactApi } from '../api/contact.api';

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContactApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};
