import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProjectsApi,
  getProjectByIdApi,
  addProjectApi,
  updateProjectApi,
  deleteProjectApi,
} from '../api/project.api';
import type { UpdateProjectPayload } from '../types/project.types';

export const useGetProjects = (params: { search?: string } = {}) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => {
      const response = await getProjectsApi(params);
      return response.data;
    },
  });
};

export const useGetProjectById = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const response = await getProjectByIdApi(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useAddProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateProjectPayload }) => {
      const response = await updateProjectApi({ id, payload });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
