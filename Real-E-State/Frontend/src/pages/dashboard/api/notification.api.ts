import api from "../../../services/api/axios";

export interface LowStockProduct {
  _id: string;
  title: string;
  category: string;
  quantity: number;
  isRead?: boolean;
}

export interface LowStockNotificationResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    products: LowStockProduct[];
  };
}

export const getLowStockNotificationsApi = async (): Promise<LowStockNotificationResponse> => {
  const response = await api.get("api/v1/notifications/low-stock");
  return response.data;
};

export const markNotificationAsReadApi = async (id: string) => {
  const response = await api.put(`api/v1/notifications/read/${id}`);
  return response.data;
};

export const markAllNotificationsAsReadApi = async () => {
  const response = await api.put("api/v1/notifications/read-all");
  return response.data;
};
