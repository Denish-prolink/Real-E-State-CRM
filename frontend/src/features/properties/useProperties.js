import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const response = await api.get('/properties');
      return response.data.data;
    }
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (propertyData) => {
      const response = await api.post('/properties', propertyData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    }
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, propertyData }) => {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    }
  });
};
