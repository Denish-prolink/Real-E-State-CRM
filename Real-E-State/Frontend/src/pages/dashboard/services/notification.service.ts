import { getLowStockNotificationsApi, markNotificationAsReadApi, markAllNotificationsAsReadApi } from "../api/notification.api";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const getLowStockNotifications = async () => {
  try {
    const response = await getLowStockNotificationsApi();
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message, { cause: error });
    }
    throw new Error("Failed to fetch low-stock notifications. Please try again.", { cause: error });
  }
};

export const markNotificationAsRead = async (id: string) => {
  try {
    const response = await markNotificationAsReadApi(id);
    return response.data;
  } catch (error) {
    throw new Error("Failed to mark notification as read.", { cause: error });
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await markAllNotificationsAsReadApi();
    return response.data;
  } catch (error) {
    throw new Error("Failed to mark all notifications as read.", { cause: error });
  }
};
