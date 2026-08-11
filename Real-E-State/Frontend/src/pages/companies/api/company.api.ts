import type { AddCompanyPayload, Company, GetCompaniesResponse, UpdateCompanyPayload } from "../types/company.types";

import api from "../../../services/api/axios";

export const getCompaniesApi = async (params: { page: number; limit: number; search?: string }): Promise<GetCompaniesResponse> => {
  const response = await api.get("/api/v1/companies", { params });
  return response.data.data;
};

export const getCompanyByIdApi = async (id: string): Promise<Company> => {
  const response = await api.get(`/api/v1/companies/${id}`);
  return response.data.data;
};

export const addCompanyApi = async (payload: AddCompanyPayload): Promise<Company> => {
  const response = await api.post("/api/v1/companies", payload);
  return response.data.data;
};

export interface UpdateCompanyResponse {
  success: boolean;
  message: string;
  data: Company;
}

export const updateCompanyApi = async (id: string, payload: UpdateCompanyPayload): Promise<UpdateCompanyResponse> => {
  const response = await api.put(`/api/v1/companies/${id}`, payload);
  return response.data;
};

export const deleteCompanyApi = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/companies/${id}`);
};

export const uploadCompanyLogoApi = async (
  formData: FormData
): Promise<{ success: boolean; message: string; data: { url: string } }> => {
  const response = await api.post("/api/v1/companies/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
