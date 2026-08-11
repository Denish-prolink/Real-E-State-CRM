import { authService } from "../services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "../../../app/hooks";
import { setCredentials } from "../slices/auth.slice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.accessToken,
        })
      );
      toast.success(data.message || "Login successful");
      navigate("/dashboard");
    },
    onError: (error) => {
      const err = error as AuthError;
      const errMsg = err.response?.data?.message || err.message || "Login failed";
      toast.error(errMsg);
    },
  });
};