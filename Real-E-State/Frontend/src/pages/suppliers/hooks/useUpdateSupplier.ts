import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { SupplierFormValues } from "../types/supplier.types";
import { updateSupplier } from "../services/supplier.service";

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SupplierFormValues }) =>
      updateSupplier({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};
