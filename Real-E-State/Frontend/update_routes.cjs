const fs = require('fs');
const file = 'src/app/router/index.tsx';
let content = fs.readFileSync(file, 'utf8');

const map = {
  'DashboardOverview': 'dashboard',
  'LeadsPage': 'leads',
  'LeadDetailsPage': 'leads',
  'BuyersPage': 'buyers',
  'SellersPage': 'sellers',
  'PropertiesPage': 'properties',
  'ProjectsPage': 'projects',
  'TowersPage': 'towers',
  'UnitsPage': 'units',
  'DealsPage': 'deals',
  'SiteVisitsPage': 'sitevisits',
  'CompaniesPage': 'agencies',
  'CompanyDetailsPage': 'agencies',
  'InventoryPage': 'inventory',
  'ProductsPage': 'products',
  'ProductDetailsPage': 'products',
  'CategoriesPage': 'categories',
  'SkusPage': 'skus',
  'SuppliersPage': 'suppliers',
  'WarehousesPage': 'warehouses',
  'WarehouseDetailsPage': 'warehouses',
  'SalesPage': 'sales',
  'OrdersPage': 'orders',
  'CreateOrderPage': 'orders',
  'OrderDetailsPage': 'orders',
  'ContactsPage': 'contacts',
  'ContactDetailsPage': 'contacts',
  'EmployeesPage': 'users',
  'ReportsPage': 'reports',
  'ProfilePage': 'profile',
  'SettingsPage': 'settings',
  'CalendarPage': 'calendar',
  'TasksPage': 'tasks'
};

for (const [component, moduleName] of Object.entries(map)) {
  const regex = new RegExp('allowedRoles=\\{[^\\}]+\\}\\>\\s*\\<(' + component + ') \\/\\>', 'g');
  content = content.replace(regex, 'moduleName="' + moduleName + '">\n            <$1 />');
}

fs.writeFileSync(file, content);
