import { addSupplierApi, getSuppliersApi, updateSupplierApi, deleteSupplierApi } from '../api/supplier.api';
import type { SupplierFormValues } from '../types/supplier.types';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const addSupplier = async (data: SupplierFormValues) => {
  try {
    const response = await addSupplierApi(data);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: error });
    }
    throw new Error('Failed to add supplier. Please try again.', { cause: error });
  }
};

export const getSuppliers = async (params: { page?: number; perPage?: number; search?: string } = {}) => {
  try {
    const response = await getSuppliersApi(params);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: error });
    }
    throw new Error('Failed to fetch suppliers. Please try again.', { cause: error });
  }
};

export const updateSupplier = async ({ id, data }: { id: string; data: SupplierFormValues }) => {
  try {
    const response = await updateSupplierApi(id, data);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: error });
    }
    throw new Error('Failed to update supplier. Please try again.', { cause: error });
  }
};

export const deleteSupplier = async (id: string) => {
  try {
    const response = await deleteSupplierApi(id);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: error });
    }
    throw new Error('Failed to delete supplier. Please try again.', { cause: error });
  }
};
