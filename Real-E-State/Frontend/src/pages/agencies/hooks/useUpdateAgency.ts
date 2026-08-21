import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAgencyPayload } from "../types/agency.types";
import { toast } from "sonner";
import { updateAgencyApi } from "../api/agency.api";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useUpdateAgency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAgencyPayload }) =>
      updateAgencyApi(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
      toast.success(data.message || "Agency updated successfully");
    },
    onError: (error) => {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Failed to update agency");
    },
  });
};
