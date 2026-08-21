import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAgencyApi } from "../api/agency.api";
import { toast } from "sonner";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useDeleteAgency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAgencyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
      toast.success("Agency deleted successfully");
    },
    onError: (error) => {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || "Failed to delete agency");
    },
  });
};
