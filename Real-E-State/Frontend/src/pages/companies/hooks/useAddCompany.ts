import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCompanyApi } from "../api/company.api";
import { toast } from "sonner";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useAddCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCompanyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Company added successfully");
    },
    onError: (error) => {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Failed to add company");
    },
  });
};
