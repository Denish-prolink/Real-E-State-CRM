import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPropertiesApi,
  getPropertyByIdApi,
  addPropertyApi,
  updatePropertyApi,
  deletePropertyApi,
} from '../api/property.api';
import type { UpdatePropertyPayload } from '../types/property.types';

export const useGetProperties = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const response = await getPropertiesApi(filters);
      return response.data;
    },
  });
};

export const useGetPropertyById = (id: string) => {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: async () => {
      const response = await getPropertyByIdApi(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useAddProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPropertyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdatePropertyPayload | FormData }) => {
      const response = await updatePropertyApi({ id, payload });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePropertyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};
