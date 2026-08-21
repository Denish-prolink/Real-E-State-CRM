import { useQuery } from "@tanstack/react-query";
import { getAgencyByIdApi } from "../api/agency.api";

export const useGetAgency = (id: string | null) => {
  return useQuery({
    queryKey: ["agency", id],
    queryFn: () => getAgencyByIdApi(id as string),
    enabled: !!id,
  });
};
