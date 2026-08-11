import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateContactApi } from '../api/contact.api';

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateContactApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};
