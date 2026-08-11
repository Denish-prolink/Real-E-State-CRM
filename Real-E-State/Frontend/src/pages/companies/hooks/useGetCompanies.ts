import { useQuery } from "@tanstack/react-query";
import { getCompaniesApi } from "../api/company.api";

export const useGetCompanies = (params: { page: number; limit: number; search?: string }) => {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => getCompaniesApi(params),
  });
};
