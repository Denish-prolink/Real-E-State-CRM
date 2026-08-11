import api from '../../../services/api/axios';

export const getProfitLossApi = async (): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get('/api/v1/reports/profit-loss');
  return response.data;
};

export const getProductsReportApi = async (): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get('/api/v1/reports/products');
  return response.data;
};

export const getSellReportApi = async (): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get('/api/v1/reports/sell');
  return response.data;
};

export const getBuyReportApi = async (): Promise<{ success: boolean; message: string; data: unknown }> => {
  const response = await api.get('/api/v1/reports/buy');
  return response.data;
};
