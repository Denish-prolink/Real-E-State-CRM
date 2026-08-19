import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "@/services/api/axios";
import type { AddFollowUpPayload, FollowUp, UpdateFollowUpPayload } from "../types/followUp.types";

export const useGetFollowUps = (filters?: Record<string, any>) => {
  return useQuery<FollowUp[]>({
    queryKey: ["follow-ups", filters],
    queryFn: async () => {
      const response = await api.get("/follow-ups", { params: filters });
      return response.data.data;
    },
  });
};

export const useGetFollowUpById = (id: string) => {
  return useQuery<FollowUp>({
    queryKey: ["follow-ups", id],
    queryFn: async () => {
      const response = await api.get(`/follow-ups/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useAddFollowUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddFollowUpPayload) => {
      const response = await api.post("/follow-ups", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow-ups"] });
    },
  });
};

export const useUpdateFollowUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateFollowUpPayload }) => {
      const response = await api.put(`/follow-ups/${id}`, payload);
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["follow-ups"] });
      queryClient.invalidateQueries({ queryKey: ["follow-ups", id] });
    },
  });
};

export const useDeleteFollowUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/follow-ups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follow-ups"] });
    },
  });
};
