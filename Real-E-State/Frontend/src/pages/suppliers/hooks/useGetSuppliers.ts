import { getSuppliers } from "../services/supplier.service";
import { useQuery } from "@tanstack/react-query";

export const useGetSuppliers = (params: { page?: number; perPage?: number; search?: string } = {}, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => getSuppliers(params),
    enabled,
  });
};
