import type { LoginPayload, LoginResponse, RegisterPayload, GoogleLoginPayload } from "../types/auth.types";

import api from "../../../services/api/axios";

export const loginApi = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post(
    "api/v1/auth/login",
    payload
  );

  return response.data;
};

export const registerApi = async (
  payload: RegisterPayload
): Promise<LoginResponse> => {
  const response = await api.post(
    "api/v1/auth/register",
    payload
  );

  return response.data;
};

export const googleLoginApi = async (
  payload: GoogleLoginPayload
): Promise<LoginResponse> => {
  const response = await api.post(
    "api/v1/auth/google-login",
    payload
  );

  return response.data;
};

export const forgotPasswordApi = async (email: string) => {
  const response = await api.post(
    "api/v1/auth/forgot-password",
    { email }
  );

  return response.data;
};

export const resetPasswordApi = async (payload: { email: string; password: string }) => {
  const response = await api.post(
    "api/v1/auth/reset-password",
    payload
  );

  return response.data;
};