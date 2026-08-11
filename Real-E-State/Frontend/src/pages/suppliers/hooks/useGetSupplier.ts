import { getSupplierByIdApi } from "../api/supplier.api";
import { useQuery } from "@tanstack/react-query";

export const useGetSupplier = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["supplier", id],
    queryFn: () => getSupplierByIdApi(id),
    enabled: !!id && enabled,
  });
};
