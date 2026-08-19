import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "@/services/api/axios";
import type { AddBookingPayload, Booking, UpdateBookingPayload } from "../types/booking.types";

export const useGetBookings = (filters?: Record<string, any>) => {
  return useQuery<Booking[]>({
    queryKey: ["bookings", filters],
    queryFn: async () => {
      const response = await api.get("/bookings", { params: filters });
      return response.data.data;
    },
  });
};

export const useGetBookingById = (id: string) => {
  return useQuery<Booking>({
    queryKey: ["bookings", id],
    queryFn: async () => {
      const response = await api.get(`/bookings/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useAddBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddBookingPayload) => {
      const response = await api.post("/bookings", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateBookingPayload }) => {
      const response = await api.put(`/bookings/${id}`, payload);
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", id] });
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/bookings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
