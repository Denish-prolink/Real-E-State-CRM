import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Bell, AlertTriangle } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { AppSidebar } from "./components/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { logout } from "@/pages/auth/slices/auth.slice";
import { useGetLowStockNotifications } from "@/pages/dashboard/hooks/useGetNotifications";
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/pages/dashboard/services/notification.service";
import { ModeToggle } from "@/components/mode-toggle";

interface LowStockProduct {
  _id: string;
  title: string;
  category: string;
  quantity: number;
  isRead?: boolean;
}

function NotificationBell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useGetLowStockNotifications();
  const products = (data?.products || []) as LowStockProduct[];
  const count = data?.count || 0;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      queryClient.invalidateQueries({ queryKey: ["lowStockNotifications"] });
    } catch (error) {
      console.error(error);
    } finally {
      navigate(`/products/${id}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      queryClient.invalidateQueries({ queryKey: ["lowStockNotifications"] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors cursor-pointer outline-none">
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-card animate-pulse">
            {count}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl p-0 overflow-hidden bg-card border border-border shadow-md">
        <div className="px-4 py-3 border-b border-border bg-muted/20 flex items-center justify-between">
          <span className="font-semibold text-sm text-foreground">Notifications</span>
          <div className="flex items-center gap-2">
            {count > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
                {count} Low Stock
              </span>
            )}
            {products.length > 0 && count > 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAllAsRead();
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium focus:outline-none"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto divide-y divide-border">
          {products.length > 0 ? (
            products.map((product) => (
              <DropdownMenuItem
                key={product._id}
                onClick={() => handleMarkAsRead(product._id)}
                className={`flex items-start gap-3 p-3 cursor-pointer focus:bg-muted/50 transition-colors ${product.isRead ? 'opacity-60' : 'bg-muted/10'}`}
              >
                <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{product.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {!product.isRead && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                    <span className={`text-xs font-semibold ${product.isRead ? 'text-muted-foreground' : 'text-red-600 dark:text-red-400'}`}>
                      {product.quantity} units remaining
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-4 py-8 text-center flex flex-col items-center justify-center text-muted-foreground">
              <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mb-2">
                <Bell className="h-5 w-5 text-indigo-500" />
              </div>
              <p className="text-sm font-medium text-foreground">All stocks healthy</p>
              <p className="text-xs mt-0.5 text-muted-foreground">No low stock warnings.</p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || user.role === "super_admin") return;

    const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const socket = io(socketUrl, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to notification socket server");
      if (user.companyId?._id) {
        socket.emit("join_company", user.companyId._id);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    socket.on("low_stock_update", () => {
      console.log("Low stock update event received, refetching...");
      queryClient.invalidateQueries({ queryKey: ["lowStockNotifications"] });
      queryClient.refetchQueries({ queryKey: ["lowStockNotifications"] });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from notification socket server");
    });

    return () => {
      socket.disconnect();
    };
  }, [user, queryClient]);

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
                {user?.role !== "super_admin" && <NotificationBell />}

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