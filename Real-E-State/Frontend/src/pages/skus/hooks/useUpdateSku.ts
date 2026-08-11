import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSku } from '../services/sku.service';
import type { SkuFormValues } from '../types/sku.types';

export const useUpdateSku = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SkuFormValues }) => updateSku(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skus'] });
      queryClient.invalidateQueries({ queryKey: ['sku'] });
    },
  });
};
