import { useQuery } from "@tanstack/react-query";
import { getLowStockNotifications } from "../services/notification.service";

export const useGetLowStockNotifications = () => {
  return useQuery({
    queryKey: ["lowStockNotifications"],
    queryFn: () => getLowStockNotifications(),
    refetchOnWindowFocus: true,
  });
};
