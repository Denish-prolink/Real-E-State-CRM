import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { SupplierFormValues } from "../types/supplier.types";
import { addSupplier } from "../services/supplier.service";

export const useAddSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupplierFormValues) => addSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};
