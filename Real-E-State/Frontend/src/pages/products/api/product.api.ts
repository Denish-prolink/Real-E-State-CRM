import api from '../../../services/api/axios';

export const addProductApi = async (
  payload: FormData
): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.post("api/v1/products", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getProductsApi = async (params: { page?: number; perPage?: number; search?: string } = {}): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get("api/v1/products", { params });
  return response.data;
};

export const getProductByIdApi = async (id: string): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get(`api/v1/products/${id}`);
  return response.data;
};

export const updateProductApi = async (
  id: string,
  payload: FormData
): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.put(`api/v1/products/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProductApi = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`api/v1/products/${id}`);
  return response.data;
};

export const uploadProductImageApi = async (
  formData: FormData
): Promise<{ success: boolean; message: string; data: { url: string } }> => {
  const response = await api.post("api/v1/products/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
