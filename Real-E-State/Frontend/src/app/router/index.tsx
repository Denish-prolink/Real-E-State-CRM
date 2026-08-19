import {
  Navigate,
  createBrowserRouter
} from "react-router-dom";

import CategoriesPage from "../../pages/categories/pages/CategoriesPage";
import CompaniesPage from "../../pages/companies/pages/CompaniesPage";
import CompanyDetailsPage from "../../pages/companies/pages/CompanyDetailsPage";
import ContactsPage from "../../pages/contacts/pages/ContactsPage";
import ContactDetailsPage from "../../pages/contacts/pages/ContactDetailsPage";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardOverview from "../../pages/dashboard/pages/DashboardOverview";
import EmployeesPage from "../../pages/employees/pages/EmployeesPage";
import ForgotPasswordPage from "../../pages/auth/pages/ForgotPasswordPage";
import InventoryPage from "../../pages/inventory/pages/InventoryPage";
import LoginPage from "../../pages/auth/pages/LoginPage";
import PrivateRoute from "./private-routes";
import ProductsPage from "../../pages/products/pages/ProductsPage";
import ProductDetailsPage from "../../pages/products/pages/ProductDetailsPage";
import ProfilePage from "../../pages/profile/pages/ProfilePage";
import PublicRoute from "./public-route";
import ReportsPage from "../../pages/reports/pages/ReportsPage";
import ResetPasswordPage from "../../pages/auth/pages/ResetPasswordPage";
import RoleGuard from "./role-guard";
import SalesPage from "../../pages/sales/pages/SalesPage";
import SettingsPage from "../../pages/dashboard/pages/SettingsPage";
import SuppliersPage from "../../pages/suppliers/pages/SuppliersPage";
import WarehousesPage from "../../pages/warehouses/pages/WarehousesPage";
import WarehouseDetailsPage from "../../pages/warehouses/pages/WarehouseDetailsPage";
import SkusPage from "../../pages/skus/pages/SkusPage";
import OrdersPage from "../../pages/orders/pages/OrdersPage";
import CreateOrderPage from "../../pages/orders/pages/CreateOrderPage";
import OrderDetailsPage from "../../pages/orders/pages/OrderDetailsPage";
import LeadsPage from "../../pages/leads/pages/LeadsPage";
import LeadDetailsPage from "../../pages/leads/pages/LeadDetailsPage";
import PropertiesPage from "../../pages/properties/PropertiesPage";
import ProjectsPage from "../../pages/projects/pages/ProjectsPage";
import TowersPage from "../../pages/towers/pages/TowersPage";
import UnitsPage from "../../pages/units/pages/UnitsPage";
import DealsPage from "../../pages/deals/DealsPage";
import SiteVisitsPage from "../../pages/site-visits/SiteVisitsPage";
import BuyersPage from "../../pages/buyers/pages/BuyersPage";
import SellersPage from "../../pages/sellers/pages/SellersPage";
import CalendarPage from "../../pages/calendar/pages/CalendarPage";
import TasksPage from "../../pages/tasks/pages/TasksPage";
import BookingsPage from "../../pages/bookings/BookingsPage";
import PaymentsPage from "../../pages/payments/PaymentsPage";
import FollowUpsPage from "../../pages/follow-ups/FollowUpsPage";





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
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <DashboardOverview />
          </RoleGuard>
        ),
      },
      {
        path: "/leads",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <LeadsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/leads/:id",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <LeadDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/buyers",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <BuyersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/sellers",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <SellersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/properties",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <PropertiesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/projects",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <ProjectsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/towers",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <TowersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/units",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <UnitsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/deals",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <DealsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/site-visits",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <SiteVisitsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/follow-ups",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <FollowUpsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/bookings",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <BookingsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/payments",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <PaymentsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/companies",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
            <CompaniesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/companies/:id",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
            <CompanyDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/inventory",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <InventoryPage />
          </RoleGuard>
        ),
      },
      {
        path: "/products",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <ProductsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/products/:id",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <ProductDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/categories",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <CategoriesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/skus",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <SkusPage />
          </RoleGuard>
        ),
      },
      {
        path: "/suppliers",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY"]}>
            <SuppliersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/warehouses",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY"]}>
            <WarehousesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/warehouses/:id",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY"]}>
            <WarehouseDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/sales",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY"]}>
            <SalesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/orders",
        element: <Navigate to="/orders/sell" replace />,
      },
      {
        path: "/orders/sell",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY"]}>
            <OrdersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/orders/purchase",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY"]}>
            <OrdersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/orders/:type/create",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY"]}>
            <CreateOrderPage />
          </RoleGuard>
        ),
      },
      {
        path: "/orders/:type/:id",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY"]}>
            <OrderDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/contacts",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY"]}>
            <ContactsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/contacts/:id",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY"]}>
            <ContactDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/employees",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY"]}>
            <EmployeesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/reports",
        element: <Navigate to="/reports/profit-loss" replace />,
      },
      {
        path: "/reports/:type",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY"]}>
            <ReportsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/profile",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <ProfilePage />
          </RoleGuard>
        ),
      },
      {
        path: "/settings",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <SettingsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/calendar",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <CalendarPage />
          </RoleGuard>
        ),
      },
      {
        path: "/tasks",
        element: (
          <RoleGuard allowedRoles={["SUPER_ADMIN", "STAFF", "AGENCY", "AGENT"]}>
            <TasksPage />
          </RoleGuard>
        ),
      },
    ],
  },
]);

export default router;
