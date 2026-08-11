import type { AddEmployeePayload, Employee, UpdateEmployeePayload } from '../types/employee.types';

import api from '../../../services/api/axios';

export const getEmployeesApi = async (search?: string): Promise<{ success: boolean; message: string; data: Employee[] }> => {
  const response = await api.get('/api/v1/employees', {
    params: { search },
  });
  return response.data;
};

export const getEmployeeByIdApi = async (id: string): Promise<{ success: boolean; message: string; data: Employee }> => {
  const response = await api.get(`/api/v1/employees/${id}`);
  return response.data;
};

export const addEmployeeApi = async (payload: AddEmployeePayload): Promise<{ success: boolean; message: string; data: Employee }> => {
  const response = await api.post('/api/v1/employees', payload);
  return response.data;
};

export const updateEmployeeApi = async ({ id, payload }: { id: string; payload: UpdateEmployeePayload }): Promise<{ success: boolean; message: string; data: Employee }> => {
  const response = await api.put(`/api/v1/employees/${id}`, payload);
  return response.data;
};

export const deleteEmployeeApi = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/employees/${id}`);
};
