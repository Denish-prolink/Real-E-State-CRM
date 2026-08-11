import { useEffect } from "react";
import { useGoogleLogin } from "./useGoogleLogin";

export const useGoogleAuth = () => {
  const { mutate, isPending } = useGoogleLogin();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const signInWithGoogle = () => {
    if (!googleClientId || googleClientId === "your_google_client_id") {
      alert(
        "Google Client ID is not configured.\nPlease add VITE_GOOGLE_CLIENT_ID=your_client_id to your Frontend/.env file."
      );
      return;
    }

    const redirectUri = window.location.origin + window.location.pathname;
    const scope = "email profile openid";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=${encodeURIComponent(scope)}`;

    // Redirect to the real Google login page
    window.location.href = authUrl;
  };

  useEffect(() => {
    const handleHash = async () => {
      const hash = window.location.hash;
      if (!hash) return;

      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");

      if (accessToken) {
        // Clean the hash from the URL
        window.history.replaceState(null, "", window.location.pathname);

        try {
          // Fetch user info from Google API
          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const userInfo = await res.json();

          if (userInfo.email) {
            mutate({
              email: userInfo.email,
              firstName: userInfo.given_name || "Google",
              lastName: userInfo.family_name || "User",
            });
          }
        } catch (err) {
          console.error("Failed to fetch user info from Google", err);
        }
      }
    };

    handleHash();
  }, [mutate]);

  return {
    signInWithGoogle,
    isPending,
  };
};
