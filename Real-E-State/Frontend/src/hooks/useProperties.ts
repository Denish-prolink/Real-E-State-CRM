import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api/axios';

export interface PropertyData {
  _id?: string;
  propertyId?: string;
  title: string;
  description?: string;
  propertyType: 'Apartment' | 'Villa' | 'House' | 'Plot' | 'Office' | 'Shop' | 'Warehouse' | 'Land' | 'Commercial';
  purpose: 'Sale' | 'Rent' | 'Lease';
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  status?: 'Available' | 'Reserved' | 'Blocked' | 'Booked' | 'Sold';
}

export const useProperties = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const response = await api.get('/properties', { params: filters });
      return response.data.data;
    },
  });
};

export const usePropertyById = (id: string) => {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: async () => {
      const response = await api.get(`/properties/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (propertyData: PropertyData) => {
      const response = await api.post('/properties', propertyData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, propertyData }: { id: string; propertyData: Partial<PropertyData> }) => {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/properties/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};
