import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
