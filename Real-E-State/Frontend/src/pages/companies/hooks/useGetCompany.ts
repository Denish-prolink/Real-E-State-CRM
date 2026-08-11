import { useQuery } from "@tanstack/react-query";
import { getCompanyByIdApi } from "../api/company.api";

export const useGetCompany = (id: string | null) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyByIdApi(id as string),
    enabled: !!id,
  });
};
