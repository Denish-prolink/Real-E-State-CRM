import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateCompanyPayload } from "../types/company.types";
import { toast } from "sonner";
import { updateCompanyApi } from "../api/company.api";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCompanyPayload }) =>
      updateCompanyApi(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success(data.message || "Company updated successfully");
    },
    onError: (error) => {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Failed to update company");
    },
  });
};
