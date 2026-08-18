import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBuyer } from '../services/buyer.service';

export const useUpdateBuyer = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: any) => updateBuyer({ id, data }), onSuccess: () => qc.invalidateQueries({ queryKey: ['buyers'] }) });
};
