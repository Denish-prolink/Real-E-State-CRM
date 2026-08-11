import { loginApi, registerApi, googleLoginApi } from "../api/auth.api";

export const authService = {
  login: loginApi,
  register: registerApi,
  googleLogin: googleLoginApi,
};