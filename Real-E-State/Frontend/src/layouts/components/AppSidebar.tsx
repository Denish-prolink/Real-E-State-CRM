import {
  Building,
  Building2,
  Home,
  LayoutDashboard,
  UserCheck,
  Users,
  Warehouse,
  Calendar,
  CheckSquare
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/app/hooks";

export function AppSidebar() {
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  const allNavItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Calendar",
      path: "/calendar",
      icon: Calendar,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Leads",
      path: "/leads",
      icon: UserCheck,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Buyers",
      path: "/buyers",
      icon: Users,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Sellers",
      path: "/sellers",
      icon: Users,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Deals",
      path: "/deals",
      icon: UserCheck,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Bookings",
      path: "/bookings",
      icon: CheckSquare,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Payments",
      path: "/payments",
      icon: LayoutDashboard,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Site Visits",
      path: "/site-visits",
      icon: Home,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Follow Ups",
      path: "/follow-ups",
      icon: Calendar,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Contact",
      path: "/contacts",
      icon: Users,
      roles: ["AGENCY"],
    },
    {
      title: "Properties",
      path: "/properties",
      icon: Home,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Projects",
      path: "/projects",
      icon: Building2,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Towers",
      path: "/towers",
      icon: Building,
      roles: ["AGENCY", "AGENT", "STAFF"],
    },
    {
      title: "Company",
      path: "/companies",
      icon: Building2,
      roles: ["SUPER_ADMIN"],
    },
    // {
    //   title: "Reports",
    //   path: "/reports",
    //   icon: TrendingUp,
    //   roles: ["AGENCY"],
    // },
    // {
    //   title: "Profile page",
    //   path: "/profile",
    //   icon: Settings,
    //   roles: ["AGENCY", "AGENT", "STAFF"],
    // },
  ];

  const userRole = user?.role || "AGENT";
  const navItems = allNavItems.filter((item) => item.roles.includes(userRole));

  return (
    <Sidebar className="border-r border-border">
      {/* Sidebar Header */}
      <SidebarHeader className="h-16 px-4 flex items-start justify-center border-b border-border">
        <div className="flex items-center gap-3 ">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <Warehouse className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-md leading-tight">Real-E-State <span className="text-blue-500">CRM</span></span>
          </div>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link to={item.path} />}
                      isActive={isActive}
                      className={`w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                        ? "bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-950/45 dark:text-indigo-400"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Order — Collapsible with sub-items */}
              {/* {(userRole === "AGENCY") && (
                <div className="flex flex-col gap-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setOrdersOpen(!ordersOpen)}
                      className={`w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${location.pathname.startsWith("/orders")
                        ? "bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-950/45 dark:text-indigo-400"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <ShoppingCart className={`h-4 w-4 shrink-0 ${location.pathname.startsWith("/orders") ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                      <span className="flex-1 text-left">Order</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${ordersOpen ? "rotate-180" : ""}`} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {ordersOpen && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          render={<Link to="/orders/sell" />}
                          isActive={location.pathname === "/orders/sell"}
                          className={`gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === "/orders/sell"
                            ? "bg-indigo-50/70 text-indigo-700 font-medium dark:bg-indigo-950/30 dark:text-indigo-400"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                        >
                          <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
                          <span>Sell</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          render={<Link to="/orders/purchase" />}
                          isActive={location.pathname === "/orders/purchase"}
                          className={`gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === "/orders/purchase"
                            ? "bg-indigo-50/70 text-indigo-700 font-medium dark:bg-indigo-950/30 dark:text-indigo-400"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                        >
                          <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
                          <span>Purchase</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </div>
              )} */}


            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* <Separator className="bg-border mx-2 w-auto" /> */}
      {/* <Separator/> */}

      {/* Sidebar Footer */}
      {/* <SidebarFooter className="p-4">
        <div className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold text-sm">
              {user ? (
                user.firstName ? (
                  user.firstName.charAt(0).toUpperCase()
                ) : (
                  user.email.charAt(0).toUpperCase()
                )
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate leading-tight">
                {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User" : "User"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email || "user@example.com"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/35 transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter> */}
    </Sidebar>
  );
}
