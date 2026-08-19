import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "@/services/api/axios";
import type { AddPaymentPayload, Payment, UpdatePaymentPayload } from "../types/payment.types";

export const useGetPayments = (filters?: Record<string, any>) => {
  return useQuery<Payment[]>({
    queryKey: ["payments", filters],
    queryFn: async () => {
      const response = await api.get("/payments", { params: filters });
      return response.data.data;
    },
  });
};

export const useGetPaymentById = (id: string) => {
  return useQuery<Payment>({
    queryKey: ["payments", id],
    queryFn: async () => {
      const response = await api.get(`/payments/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useAddPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddPaymentPayload) => {
      const response = await api.post("/payments", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdatePaymentPayload }) => {
      const response = await api.put(`/payments/${id}`, payload);
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payments", id] });
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/payments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};
