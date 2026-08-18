import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSeller } from '../services/seller.service';

export const useDeleteSeller = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteSeller(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['sellers'] }) });
};
