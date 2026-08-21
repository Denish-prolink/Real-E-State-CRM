import {
  Navigate,
  createBrowserRouter
} from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardOverview from "../../pages/dashboard/pages/DashboardOverview";
import ForgotPasswordPage from "../../pages/auth/pages/ForgotPasswordPage";
import LoginPage from "../../pages/auth/pages/LoginPage";
import PrivateRoute from "./private-routes";
import PublicRoute from "./public-route";
import ResetPasswordPage from "../../pages/auth/pages/ResetPasswordPage";
import RoleGuard from "./role-guard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicRoute>
        <ResetPasswordPage />
      </PublicRoute>
    ),
  },
  {
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <DashboardOverview />
          </RoleGuard>
        ),
      },
    ],
  },
]);

export default router;
