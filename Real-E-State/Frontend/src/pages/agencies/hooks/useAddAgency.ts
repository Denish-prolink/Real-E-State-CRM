import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAgencyApi } from "../api/agency.api";
import { toast } from "sonner";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useAddAgency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAgencyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
      toast.success("Agency added successfully");
    },
    onError: (error) => {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Failed to add agency");
    },
  });
};
