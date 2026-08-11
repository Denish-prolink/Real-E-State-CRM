import { forgotPasswordApi } from "../api/auth.api";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface AuthError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: (data) => {
      // For testing without email service, log the token or show it. 
      // In production, we just say "Email sent".
      if (data.data?.resetToken) {
        toast.success(`Reset token generated!`, {
          description: `Token: ${data.data.resetToken}`,
          duration: 10000,
        });
        navigator.clipboard.writeText(data.data.resetToken);
        toast.info("Token copied to clipboard!");
        console.log("RESET TOKEN (for testing):", data.data.resetToken);
      } else {
        toast.success("If the email exists, a reset link has been sent.");
      }
    },
    onError: (error) => {
      const err = error as AuthError;
      toast.error(
        err?.response?.data?.message || "Failed to send reset email"
      );
    },
  });
};
