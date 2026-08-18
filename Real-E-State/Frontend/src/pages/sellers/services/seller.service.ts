import { getSellersApi, addSellerApi, updateSellerApi, deleteSellerApi } from '../api/seller.api';
import type { SellerFormValues } from '../types/seller.types';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const getSellers = async (params: { page?: number; perPage?: number; search?: string } = {}) => {
  try {
    const response = await getSellersApi(params);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error('Failed to fetch sellers');
  }
};

export const addSeller = async (data: SellerFormValues) => {
  try {
    const response = await addSellerApi(data);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error('Failed to add seller');
  }
};

export const updateSeller = async ({ id, data }: { id: string; data: SellerFormValues }) => {
  try {
    const response = await updateSellerApi(id, data);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error('Failed to update seller');
  }
};

export const deleteSeller = async (id: string) => {
  try {
    const response = await deleteSellerApi(id);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error('Failed to delete seller');
  }
};
