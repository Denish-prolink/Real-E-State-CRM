import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "@/services/api/axios";
import type { AddDealPayload, Deal, UpdateDealPayload } from "../types/deal.types";

export const useGetDeals = (filters?: Record<string, any>) => {
  return useQuery<Deal[]>({
    queryKey: ["deals", filters],
    queryFn: async () => {
      const response = await api.get("/deals", { params: filters });
      return response.data.data;
    },
  });
};

export const useGetDealById = (id: string) => {
  return useQuery<Deal>({
    queryKey: ["deals", id],
    queryFn: async () => {
      const response = await api.get(`/deals/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useAddDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddDealPayload) => {
      const response = await api.post("/deals", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateDealPayload }) => {
      const response = await api.put(`/deals/${id}`, payload);
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["deals", id] });
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/deals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
};
