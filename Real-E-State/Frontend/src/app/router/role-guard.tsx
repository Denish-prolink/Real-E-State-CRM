import { Navigate } from "react-router-dom";
import type { RootState } from "../store";
import { useSelector } from "react-redux";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);
  
  if (!user || !user.role) {
    // If no user or no role, might want to redirect to a generic unauthorized or login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect somewhere if they don't have access
    if (user.role === 'super_admin') {
      return <Navigate to="/companies" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

