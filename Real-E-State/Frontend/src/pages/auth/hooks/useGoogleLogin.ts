import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
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

export const useGoogleLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.googleLogin,
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          user: data.data.user,
          accessToken: data.data.accessToken,
        })
      );
      toast.success(data.message || "Google login successful");
      navigate("/dashboard");
    },
    onError: (error) => {
      const err = error as AuthError;
      const errMsg = err.response?.data?.message || err.message || "Google login failed";
      toast.error(errMsg);
    },
  });
};
