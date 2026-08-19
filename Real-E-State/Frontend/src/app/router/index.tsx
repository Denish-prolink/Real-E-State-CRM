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
          <RoleGuard moduleName="dashboard">
            <DashboardOverview />
          </RoleGuard>
        ),
      },
      {
        path: "/leads",
        element: (
          <RoleGuard moduleName="leads">
            <LeadsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/leads/:id",
        element: (
          <RoleGuard moduleName="leads">
            <LeadDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/buyers",
        element: (
          <RoleGuard moduleName="buyers">
            <BuyersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/sellers",
        element: (
          <RoleGuard moduleName="sellers">
            <SellersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/properties",
        element: (
          <RoleGuard moduleName="properties">
            <PropertiesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/projects",
        element: (
          <RoleGuard moduleName="projects">
            <ProjectsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/towers",
        element: (
          <RoleGuard moduleName="towers">
            <TowersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/units",
        element: (
          <RoleGuard moduleName="units">
            <UnitsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/deals",
        element: (
          <RoleGuard moduleName="deals">
            <DealsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/site-visits",
        element: (
          <RoleGuard moduleName="sitevisits">
            <SiteVisitsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/companies",
        element: (
          <RoleGuard moduleName="agencies">
            <CompaniesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/companies/:id",
        element: (
          <RoleGuard moduleName="agencies">
            <CompanyDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/inventory",
        element: (
          <RoleGuard moduleName="inventory">
            <InventoryPage />
          </RoleGuard>
        ),
      },
      {
        path: "/products",
        element: (
          <RoleGuard moduleName="products">
            <ProductsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/products/:id",
        element: (
          <RoleGuard moduleName="products">
            <ProductDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/categories",
        element: (
          <RoleGuard moduleName="categories">
            <CategoriesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/skus",
        element: (
          <RoleGuard moduleName="skus">
            <SkusPage />
          </RoleGuard>
        ),
      },
      {
        path: "/suppliers",
        element: (
          <RoleGuard moduleName="suppliers">
            <SuppliersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/warehouses",
        element: (
          <RoleGuard moduleName="warehouses">
            <WarehousesPage />
          </RoleGuard>
        ),
      },
      {
        path: "/warehouses/:id",
        element: (
          <RoleGuard moduleName="warehouses">
            <WarehouseDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/sales",
        element: (
          <RoleGuard moduleName="sales">
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
          <RoleGuard moduleName="orders">
            <OrdersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/orders/purchase",
        element: (
          <RoleGuard moduleName="orders">
            <OrdersPage />
          </RoleGuard>
        ),
      },
      {
        path: "/orders/:type/create",
        element: (
          <RoleGuard moduleName="orders">
            <CreateOrderPage />
          </RoleGuard>
        ),
      },
      {
        path: "/orders/:type/:id",
        element: (
          <RoleGuard moduleName="orders">
            <OrderDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/contacts",
        element: (
          <RoleGuard moduleName="contacts">
            <ContactsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/contacts/:id",
        element: (
          <RoleGuard moduleName="contacts">
            <ContactDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/employees",
        element: (
          <RoleGuard moduleName="users">
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
          <RoleGuard moduleName="reports">
            <ReportsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/profile",
        element: (
          <RoleGuard moduleName="profile">
            <ProfilePage />
          </RoleGuard>
        ),
      },
      {
        path: "/settings",
        element: (
          <RoleGuard moduleName="settings">
            <SettingsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/calendar",
        element: (
          <RoleGuard moduleName="calendar">
            <CalendarPage />
          </RoleGuard>
        ),
      },
      {
        path: "/tasks",
        element: (
          <RoleGuard moduleName="tasks">
            <TasksPage />
          </RoleGuard>
        ),
      },
    ],
  },
]);

export default router;
