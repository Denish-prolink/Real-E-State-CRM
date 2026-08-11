import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addContactApi } from '../api/contact.api';

export const useAddContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addContactApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};
