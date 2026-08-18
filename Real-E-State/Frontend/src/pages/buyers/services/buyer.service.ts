import { getBuyersApi, addBuyerApi, updateBuyerApi, deleteBuyerApi } from '../api/buyer.api';
import type { BuyerFormValues } from '../types/buyer.types';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const getBuyers = async (params: { page?: number; perPage?: number; search?: string } = {}) => {
  try {
    const response = await getBuyersApi(params);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error('Failed to fetch buyers');
  }
};

export const addBuyer = async (data: BuyerFormValues) => {
  try {
    const response = await addBuyerApi(data);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error('Failed to add buyer');
  }
};

export const updateBuyer = async ({ id, data }: { id: string; data: BuyerFormValues }) => {
  try {
    const response = await updateBuyerApi(id, data);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error('Failed to update buyer');
  }
};

export const deleteBuyer = async (id: string) => {
  try {
    const response = await deleteBuyerApi(id);
    return response;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw new Error('Failed to delete buyer');
  }
};
