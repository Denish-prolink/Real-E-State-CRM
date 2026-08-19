
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { AppSidebar } from "./components/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { logout } from "@/pages/auth/slices/auth.slice";
import { ModeToggle } from "@/components/mode-toggle";



export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getBreadcrumbName = () => {
    const path = location.pathname;

    if (path === "/dashboard") return "Dashboard";
    if (path === "/properties") return "Properties";
    if (path === "/projects") return "Projects";
    if (path === "/towers") return "Towers";
    if (path === "/units") return "Units";
    if (path === "/inventory") return "Inventory";
    if (path === "/products") return "Products";
    if (path.startsWith("/products/")) return "Product View";
    if (path === "/categories") return "Category";
    if (path === "/skus") return "SKUs";
    if (path === "/warehouses") return "Warehouse Management";
    if (path === "/sales") return "Sales Management";
    if (path === "/companies") return "Company";
    if (path.startsWith("/companies/")) return "Company View";
    if (path === "/contacts") return "Contact";
    if (path.startsWith("/contacts/")) return "Contact View";
    if (path === "/employees") return "Employee";
    if (path === "/reports") return "Reports";
    if (path.startsWith("/orders")) return "Order";
    if (path === "/profile") return "Profile";
    if (path === "/settings") return "Settings";

    return "Dashboard";
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-slate-50/40 dark:bg-zinc-950/40 text-foreground">
          <AppSidebar />

          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
              {/* Left */}
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-9 w-9 border hover:bg-muted text-muted-foreground transition-colors" />

                <div className="hidden sm:block h-4 w-px bg-border" />

                <nav className="hidden sm:flex items-center text-sm font-medium">
                  <span className="text-foreground font-semibold">
                    {getBreadcrumbName()}
                  </span>
                </nav>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">
                <ModeToggle />

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center  rounded-full px-1 py-1 hover:border-2 transition-colors  cursor-pointer">
                    {/* Avatar */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold text-sm">
                      {user ? (
                        user.firstName
                          ? user.firstName.charAt(0).toUpperCase()
                          : user.email.charAt(0).toUpperCase()
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>

                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-64 rounded-xl"
                  >
                    <div className="px-3 py-2 flex flex-col gap-1 text-sm">
                      <span className="font-semibold text-foreground">
                        {user
                          ? `${user.firstName || ""} ${
                              user.lastName || ""
                            }`.trim()
                          : "User"}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                    
                    <DropdownMenuSeparator />

                    {user?.role !== "super_admin" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => navigate("/profile")}
                          className="cursor-pointer"
                        >
                          <User className="mr-2 h-4 w-4" />
                          My Profile
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}