import { useQuery } from '@tanstack/react-query';
import {
  getBuyReportApi,
  getProductsReportApi,
  getProfitLossApi,
  getSellReportApi,
} from '../api/report.api';

export const useGetProfitLoss = () => {
  return useQuery({
    queryKey: ['report-profit-loss'],
    queryFn: async () => {
      const response = await getProfitLossApi();
      return response.data;
    },
  });
};

export const useGetProductsReport = () => {
  return useQuery({
    queryKey: ['report-products'],
    queryFn: async () => {
      const response = await getProductsReportApi();
      return response.data;
    },
  });
};

export const useGetSellReport = () => {
  return useQuery({
    queryKey: ['report-sell'],
    queryFn: async () => {
      const response = await getSellReportApi();
      return response.data;
    },
  });
};

export const useGetBuyReport = () => {
  return useQuery({
    queryKey: ['report-buy'],
    queryFn: async () => {
      const response = await getBuyReportApi();
      return response.data;
    },
  });
};
