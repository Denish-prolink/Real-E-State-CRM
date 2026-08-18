import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSeller } from '../services/seller.service';

export const useUpdateSeller = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: any) => updateSeller({ id, data }), onSuccess: () => qc.invalidateQueries({ queryKey: ['sellers'] }) });
};
