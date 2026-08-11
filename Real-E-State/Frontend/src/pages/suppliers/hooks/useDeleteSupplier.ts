import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteSupplier } from "../services/supplier.service";

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};
