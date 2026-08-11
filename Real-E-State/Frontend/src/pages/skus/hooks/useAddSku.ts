import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addSku } from '../services/sku.service';
import type { SkuFormValues } from '../types/sku.types';

export const useAddSku = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SkuFormValues) => addSku(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skus'] });
    },
  });
};
