import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCategory } from '../services/category.service';
import type { CategoryFormValues } from '../types/category.types';

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormValues }) =>
      updateCategory({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
