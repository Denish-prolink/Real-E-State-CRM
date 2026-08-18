import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addSeller } from '../services/seller.service';

export const useAddSeller = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: any) => addSeller(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['sellers'] }) });
};
