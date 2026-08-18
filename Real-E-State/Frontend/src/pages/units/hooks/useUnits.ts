import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUnitsApi,
  getUnitByIdApi,
  addUnitApi,
  updateUnitApi,
  deleteUnitApi,
} from '../api/unit.api';
import type { UpdateUnitPayload } from '../types/unit.types';

export const useGetUnits = (
  params: { projectId?: string; towerId?: string; search?: string } = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['units', params],
    queryFn: async () => {
      const response = await getUnitsApi(params);
      return response.data;
    },
    ...options,
  });
};

export const useGetUnitById = (id: string) => {
  return useQuery({
    queryKey: ['units', id],
    queryFn: async () => {
      const response = await getUnitByIdApi(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useAddUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUnitApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateUnitPayload }) => {
      const response = await updateUnitApi({ id, payload });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUnitApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
};
