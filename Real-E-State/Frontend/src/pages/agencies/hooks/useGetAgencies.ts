import { useQuery } from "@tanstack/react-query";
import { getAgenciesApi } from "../api/agency.api";

export const useGetAgencies = (params: { page: number; limit: number; search?: string }) => {
  return useQuery({
    queryKey: ["agencies", params],
    queryFn: () => getAgenciesApi(params),
  });
};
