import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBuyer } from '../services/buyer.service';

export const useDeleteBuyer = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteBuyer(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['buyers'] }) });
};
