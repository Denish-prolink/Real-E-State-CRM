import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTowersApi,
  getTowerByIdApi,
  addTowerApi,
  updateTowerApi,
  deleteTowerApi,
} from '../api/tower.api';
import type { UpdateTowerPayload } from '../types/tower.types';

export const useGetTowers = (
  params: { projectId?: string } = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['towers', params],
    queryFn: async () => {
      const response = await getTowersApi(params);
      return response.data;
    },
    ...options,
  });
};

export const useGetTowerById = (id: string) => {
  return useQuery({
    queryKey: ['towers', id],
    queryFn: async () => {
      const response = await getTowerByIdApi(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useAddTower = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTowerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['towers'] });
    },
  });
};

export const useUpdateTower = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateTowerPayload }) => {
      const response = await updateTowerApi({ id, payload });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['towers'] });
    },
  });
};

export const useDeleteTower = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTowerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['towers'] });
    },
  });
};
