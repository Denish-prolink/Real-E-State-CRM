import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addBuyer } from '../services/buyer.service';

export const useAddBuyer = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: any) => addBuyer(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['buyers'] }) });
};
