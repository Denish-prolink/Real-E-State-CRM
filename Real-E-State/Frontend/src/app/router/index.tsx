import {
  Navigate,
  createBrowserRouter
} from "react-router-dom";

import CategoriesPage from "../../pages/categories/pages/CategoriesPage";
import AgenciesPage from "../../pages/agencies/pages/AgenciesPage";
import AgencyDetailsPage from "../../pages/agencies/pages/AgencyDetailsPage";
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
import ViewPropertyPage from "../../pages/properties/pages/ViewPropertyPage";
import ProjectsPage from "../../pages/projects/pages/ProjectsPage";
import ViewProjectPage from "../../pages/projects/pages/ViewProjectPage";
import TowersPage from "../../pages/towers/pages/TowersPage";
import ViewTowerPage from "../../pages/towers/pages/ViewTowerPage";
import UnitsPage from "../../pages/units/pages/UnitsPage";
import DealsPage from "../../pages/deals/DealsPage";
import SiteVisitsPage from "../../pages/site-visits/SiteVisitsPage";
import BuyersPage from "../../pages/buyers/pages/BuyersPage";
import SellersPage from "../../pages/sellers/pages/SellersPage";
import CalendarPage from "../../pages/calendar/pages/CalendarPage";
import TasksPage from "../../pages/tasks/pages/TasksPage";
import ViewTaskPage from "../../pages/tasks/pages/ViewTaskPage";
import DocumentsPage from "../../pages/documents/DocumentsPage";

// Placeholder Pages





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
      {
        path: "/leads",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <LeadsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/leads/:id",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <LeadDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/buyers",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <BuyersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/sellers",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <SellersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/properties",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <PropertiesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/properties/:id",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <ViewPropertyPage />
          </RoleGuard>
        ),
      },
      {
        path: "/projects",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <ProjectsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/projects/:id",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <ViewProjectPage />
          </RoleGuard>
        ),
      },
      {
        path: "/towers",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <TowersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/towers/:id",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <ViewTowerPage />
          </RoleGuard>
        ),
      },
      {
        path: "/units",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <UnitsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/deals",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <DealsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/site-visits",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <SiteVisitsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/agencies",
        element: (
          <RoleGuard allowedRoles={["super_admin"]}>
            <AgenciesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/agencies/:id",
        element: (
          <RoleGuard allowedRoles={["super_admin"]}>
            <AgencyDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/inventory",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <InventoryPage />
          </RoleGuard>
        ),
      },
      {
        path: "/products",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <ProductsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/products/:id",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <ProductDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/categories",
        element: (
          <RoleGuard allowedRoles={["agency","employee"]}>
            <CategoriesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/skus",
        element: (
          <RoleGuard allowedRoles={["agency","employee"]}>
            <SkusPage />
          </RoleGuard>
        ),
      },
      {
        path: "/suppliers",
        element: (
          <RoleGuard allowedRoles={["agency"]}>
            <SuppliersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/warehouses",
        element: (
          <RoleGuard allowedRoles={["agency"]}>
            <WarehousesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/warehouses/:id",
        element: (
          <RoleGuard allowedRoles={["agency"]}>
            <WarehouseDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/sales",
        element: (
          <RoleGuard allowedRoles={["agency"]}>
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
          <RoleGuard allowedRoles={["agency"]}>
            <OrdersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/orders/purchase",
        element: (
          <RoleGuard allowedRoles={["agency"]}>
            <OrdersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/orders/:type/create",
        element: (
          <RoleGuard allowedRoles={["agency"]}>
            <CreateOrderPage />
          </RoleGuard>
        ),
      },
      {
        path: "/orders/:type/:id",
        element: (
          <RoleGuard allowedRoles={["agency"]}>
            <OrderDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/contacts",
        element: (
          <RoleGuard allowedRoles={["agency"]}>
            <ContactsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/contacts/:id",
        element: (
          <RoleGuard allowedRoles={["agency"]}>
            <ContactDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/employees",
        element: (
          <RoleGuard allowedRoles={["agency"]}>
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
          <RoleGuard allowedRoles={["agency"]}>
            <ReportsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/profile",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <ProfilePage />
          </RoleGuard>
        ),
      },
      {
        path: "/settings",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <SettingsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/calendar",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <CalendarPage />
          </RoleGuard>
        ),
      },
      {
        path: "/tasks",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <TasksPage />
          </RoleGuard>
        ),
      },
      {
        path: "/tasks/:id",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <ViewTaskPage />
          </RoleGuard>
        ),
      },
      {
        path: "/documents",
        element: (
          <RoleGuard allowedRoles={["agency", "employee"]}>
            <DocumentsPage />
          </RoleGuard>
        ),
      },
    ],
  },
]);

export default router;
