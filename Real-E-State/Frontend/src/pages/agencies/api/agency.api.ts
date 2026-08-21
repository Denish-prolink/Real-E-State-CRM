import type { AddAgencyPayload, Agency, GetAgenciesResponse, UpdateAgencyPayload } from "../types/agency.types";

import api from "../../../services/api/axios";

export const getAgenciesApi = async (params: { page: number; limit: number; search?: string }): Promise<GetAgenciesResponse> => {
  const response = await api.get("/api/v1/agencies", { params });
  return response.data.data;
};

export const getAgencyByIdApi = async (id: string): Promise<Agency> => {
  const response = await api.get(`/api/v1/agencies/${id}`);
  return response.data.data;
};

export const addAgencyApi = async (payload: AddAgencyPayload): Promise<Agency> => {
  const response = await api.post("/api/v1/agencies", payload);
  return response.data.data;
};

export interface UpdateAgencyResponse {
  success: boolean;
  message: string;
  data: Agency;
}

export const updateAgencyApi = async (id: string, payload: UpdateAgencyPayload): Promise<UpdateAgencyResponse> => {
  const response = await api.put(`/api/v1/agencies/${id}`, payload);
  return response.data;
};

export const deleteAgencyApi = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/agencies/${id}`);
};

export const uploadAgencyLogoApi = async (
  formData: FormData
): Promise<{ success: boolean; message: string; data: { url: string } }> => {
  const response = await api.post("/api/v1/agencies/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
