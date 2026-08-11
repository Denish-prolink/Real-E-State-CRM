import { resetPasswordApi } from "../api/auth.api";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface AuthError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Password has been reset successfully. Please login.");
      navigate("/login");
    },
    onError: (error) => {
      const err = error as AuthError;
      toast.error(
        err?.response?.data?.message || "Failed to reset password"
      );
    },
  });
};
