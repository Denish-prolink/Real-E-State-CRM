import { Navigate } from "react-router-dom";
import type { RootState } from "../store";
import { useSelector } from "react-redux";
import { usePermissions } from "@/hooks/usePermissions";

interface Props {
  children: React.ReactNode;
  moduleName?: string; // Made optional for routes that are just "logged in"
}

export default function RoleGuard({ children, moduleName }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);
  const { hasAccess } = usePermissions();
  
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  if (moduleName && !hasAccess(moduleName)) {
    if (user.role === 'super_admin') {
      return <Navigate to="/companies" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

