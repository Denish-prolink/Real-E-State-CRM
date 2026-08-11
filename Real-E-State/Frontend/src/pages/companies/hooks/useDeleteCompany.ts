import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCompanyApi } from "../api/company.api";
import { toast } from "sonner";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompanyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Company deleted successfully");
    },
    onError: (error) => {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Failed to delete company");
    },
  });
};
