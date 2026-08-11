import { addProductApi, getProductsApi, updateProductApi, deleteProductApi } from '../api/product.api';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const addProduct = async (data: FormData) => {
  try {
    const response = await addProductApi(data);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: error });
    }
    throw new Error('Failed to add product. Please try again.', { cause: error });
  }
};

export const getProducts = async (params: { page?: number; perPage?: number; search?: string } = {}) => {
  try {
    const response = await getProductsApi(params);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: error });
    }
    throw new Error('Failed to fetch products. Please try again.', { cause: error });
  }
};

export const updateProduct = async ({ id, data }: { id: string; data: FormData }) => {
  try {
    const response = await updateProductApi(id, data);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: error });
    }
    throw new Error('Failed to update product. Please try again.', { cause: error });
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await deleteProductApi(id);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: error });
    }
    throw new Error('Failed to delete product. Please try again.', { cause: error });
  }
};
