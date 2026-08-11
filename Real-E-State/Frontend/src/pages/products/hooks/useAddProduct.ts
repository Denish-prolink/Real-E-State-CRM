import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProduct } from '../services/product.service';

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

