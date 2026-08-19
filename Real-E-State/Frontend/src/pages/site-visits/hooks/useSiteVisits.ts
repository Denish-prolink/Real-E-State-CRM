import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "@/services/api/axios";
import type { AddSiteVisitPayload, SiteVisit, UpdateSiteVisitPayload } from "../types/siteVisit.types";

export const useGetSiteVisits = (filters?: Record<string, any>) => {
  return useQuery<SiteVisit[]>({
    queryKey: ["site-visits", filters],
    queryFn: async () => {
      const response = await api.get("/site-visits", { params: filters });
      return response.data.data;
    },
  });
};

export const useGetSiteVisitById = (id: string) => {
  return useQuery<SiteVisit>({
    queryKey: ["site-visits", id],
    queryFn: async () => {
      const response = await api.get(`/site-visits/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useAddSiteVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddSiteVisitPayload) => {
      const response = await api.post("/site-visits", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
    },
  });
};

export const useUpdateSiteVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateSiteVisitPayload }) => {
      const response = await api.put(`/site-visits/${id}`, payload);
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      queryClient.invalidateQueries({ queryKey: ["site-visits", id] });
    },
  });
};

export const useDeleteSiteVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/site-visits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
    },
  });
};
