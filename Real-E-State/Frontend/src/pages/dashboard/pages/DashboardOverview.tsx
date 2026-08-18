import { useMemo } from "react";
import { LayoutDashboard, ShoppingCart, ShoppingBag, Package, AlertTriangle, TrendingUp, TrendingDown, Plus, ArrowRight } from "lucide-react";
import { useGetProfitLoss, useGetProductsReport, useGetSellReport, useGetBuyReport } from "../../reports/hooks/useGetReports";
import { useGetOrders } from "../../orders/hooks/useGetOrders";
import { useGetProducts } from "../../products/hooks/useGetProducts";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

const getMonthName = (monthNum: number) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[monthNum - 1] || `${monthNum}`;
};

const COLORS = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];

interface ReportItem {
  _id: {
    year: number;
    month: number;
  };
  revenue?: number;
  cost?: number;
}

interface DashboardProduct {
  _id: string;
  title: string;
  category: string;
  quantity: number;
}

interface CategoryReportItem {
  _id: string;
  totalQuantity: number;
  count?: number;
}

interface DashboardOrder {
  _id: string;
  contact?: {
    name: string;
  };
  orderType: string;
  finalPrice: number;
  status: string;
  createdAt: string;
}

interface ProfitLossData {
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  sellOrdersCount: number;
  buyOrdersCount: number;
}

interface ProductsReportSummary {
  totalProducts: number;
  totalQuantity: number;
  totalInventoryValue: number;
  lowStockItems: number;
}

interface ProductsReportData {
  summary: ProductsReportSummary;
  byCategory: CategoryReportItem[];
}

export default function DashboardOverview() {
  const navigate = useNavigate();

  // Fetch data
  const { data: profitLoss, isLoading: profitLossLoading } = useGetProfitLoss();
  const { data: productsReport, isLoading: productsReportLoading } = useGetProductsReport();
  const { data: sellReport } = useGetSellReport();
  const { data: buyReport } = useGetBuyReport();

  const profitLossData = profitLoss as ProfitLossData | undefined;
  const productsReportData = productsReport as ProductsReportData | undefined;
  const sellReportData = sellReport as ReportItem[] | undefined;
  const buyReportData = buyReport as ReportItem[] | undefined;

  const { data: ordersResponse, isLoading: ordersLoading } = useGetOrders({
    page: 1,
    perPage: 5,
  });
  const ordersData = ordersResponse as { orders: DashboardOrder[] } | undefined;
  const recentOrders = ordersData?.orders || [];

  // Fetch all products (to extract actual low stock items)
  const { data: productsResponse, isLoading: productsLoading } = useGetProducts({
    page: 1,
    perPage: 100,
  });
  const productsData = productsResponse?.data as { products: DashboardProduct[] } | undefined;
  const products = productsData?.products;

  const isLoading = profitLossLoading || productsReportLoading || ordersLoading || productsLoading;

  // Process data for sales vs purchases trends
  const monthlyDataMap: { [key: string]: { monthName: string; Sales: number; Purchases: number } } = {};

  sellReportData?.forEach((item: ReportItem) => {
    const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
    monthlyDataMap[key] = {
      monthName: `${getMonthName(item._id.month)} ${item._id.year}`,
      Sales: item.revenue || 0,
      Purchases: 0,
    };
  });

  buyReportData?.forEach((item: ReportItem) => {
    const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
    if (monthlyDataMap[key]) {
      monthlyDataMap[key].Purchases = item.cost || 0;
    } else {
      monthlyDataMap[key] = {
        monthName: `${getMonthName(item._id.month)} ${item._id.year}`,
        Sales: 0,
        Purchases: item.cost || 0,
      };
    }
  });

  const chartData = Object.keys(monthlyDataMap)
    .sort()
    .map((key) => monthlyDataMap[key])
    .slice(-6);

  // Filter out low stock products
  const lowStockProducts = useMemo(() => {
    return (products || []).filter((p: DashboardProduct) => p.quantity <= 10).slice(0, 5);
  }, [products]);

  // Process category distribution data
  const categoryData = useMemo(() => {
    if (!productsReportData?.byCategory) return [];

    // Check if there is any actual stock across categories
    const hasStock = productsReportData.byCategory.some((cat) => (cat.totalQuantity || 0) > 0);

    const mapped = productsReportData.byCategory
      .map((cat: CategoryReportItem) => ({
        name: cat._id || "Uncategorized",
        value: hasStock ? (cat.totalQuantity || 0) : (cat.count || 0),
        isStockBased: hasStock,
        actualQuantity: cat.totalQuantity || 0,
        productCount: cat.count || 0,
      }))
      .filter((cat) => cat.value > 0);

    // Sort alphabetically by category name to ensure consistent color assignment on refresh
    return mapped.sort((a, b) => a.name.localeCompare(b.name));
  }, [productsReportData]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 min-h-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-muted-foreground text-sm">Loading dashboard environment...</p>
      </div>
    );
  }

  const netProfit = profitLossData?.netProfit || 0;
  const totalRevenue = profitLossData?.totalRevenue || 0;
  const totalCost = profitLossData?.totalCost || 0;
  const lowStock = productsReportData?.summary?.lowStockItems || 0;
  const totalProducts = productsReportData?.summary?.totalProducts || 0;

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full bg-[#f8fafc] dark:bg-zinc-950/20">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/25">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none">
          <LayoutDashboard className="h-64 w-64" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-sm">
            ✨ Control Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Real-E-State <span className="text-blue-500">CRM</span></h2>
          <p className="text-indigo-200/80 text-sm leading-relaxed">
            Welcome back! Here is a live summary of your company's sales analytics, purchases, and catalog status. Use the buttons on the right to trigger rapid operations.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:mt-0">
          <Button
            size="sm"
            variant="outline"
            className="h-9 gap-1.5 border-indigo-500/30 bg-white/5 hover:bg-white/10 text-white cursor-pointer"
            onClick={() => navigate("/orders/purchase/create")}
          >
            <Plus className="h-4 w-4 text-indigo-300" />
            <span className="text-white hover:text-indigo-300">
              Buy Order
            </span>
          </Button>
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-lg shadow-indigo-600/25"
            onClick={() => navigate("/orders/sell/create")}
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Sales Revenue Card */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Sales Revenue</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-2xl font-bold mt-4 text-slate-800 dark:text-zinc-100">
              ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs">
            <span className="text-slate-400 dark:text-zinc-500">{profitLossData?.sellOrdersCount || 0} completed invoices</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-medium">Sales</span>
          </div>
        </div>

        {/* Purchase Costs Card */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Purchase Costs</span>
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-2xl font-bold mt-4 text-slate-800 dark:text-zinc-100">
              ₹{totalCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs">
            <span className="text-slate-400 dark:text-zinc-500">{profitLossData?.buyOrdersCount || 0} purchase orders</span>
            <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-medium">Expenses</span>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                {netProfit >= 0 ? "Net Profit" : "Net Loss"}
              </span>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${netProfit >= 0 ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-rose-50 dark:bg-rose-950/30"
                }`}>
                {netProfit >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                )}
              </div>
            </div>
            <h3 className={`text-2xl sm:text-2xl font-bold mt-4 ${netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}>
              {netProfit >= 0 ? "+" : "-"}₹{Math.abs(netProfit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs">
            <span className="text-slate-400 dark:text-zinc-500">Margin ratio</span>
            <span className={`px-2 py-0.5 rounded font-medium ${netProfit >= 0
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
              }`}>
              {(totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0).toFixed(1)}% Margin
            </span>
          </div>
        </div>

        {/* Real-E-State CRM Status Card */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Inventory Status</span>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${lowStock > 0 ? "bg-amber-50 dark:bg-amber-950/30" : "bg-indigo-50 dark:bg-indigo-950/30"
                }`}>
                {lowStock > 0 ? (
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Package className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            </div>
            <h3 className="text-2xl sm:text-2xl font-bold mt-4 text-slate-800 dark:text-zinc-100">
              {lowStock > 0 ? `${lowStock} Items Low` : "Healthy"}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs">
            <span className="text-slate-400 dark:text-zinc-500">Out of {totalProducts} items cataloged</span>
            <span className={`px-2 py-0.5 rounded font-medium ${lowStock > 0
              ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
              : "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
              }`}>
              {lowStock > 0 ? "Warning" : "Good"}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-col gap-1 mb-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-zinc-100">Revenue Flow Chart</h2>
            <p className="text-xs text-slate-400 dark:text-zinc-500">Monthly comparison of Sales Revenue vs Purchase Costs.</p>
          </div>
          {chartData.length > 0 ? (
            <div className="h-70 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-zinc-800" />
                  <XAxis dataKey="monthName" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    width={80}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => {
                      if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
                      if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
                      if (val >= 1000) return `₹${(val / 1000).toFixed(0)} K`;
                      return `₹${val}`;
                    }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}
                    labelStyle={{ fontWeight: "bold", fontSize: 12 }}
                    formatter={(value: unknown) => [`₹${Number(value as number).toLocaleString("en-IN")}`]}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="Sales" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" name="Sales Revenue" />
                  <Area type="monotone" dataKey="Purchases" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPurchases)" name="Purchase Costs" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-70 w-full flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 border border-dashed rounded-2xl border-slate-200 dark:border-zinc-800">
              <p className="text-sm font-medium">No sales or purchase data registered yet.</p>
            </div>
          )}
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col gap-1 mb-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-zinc-100">Stock distribution</h2>
            <p className="text-xs text-slate-400 dark:text-zinc-500">
              {categoryData[0]?.isStockBased
                ? "Distribution of stock units by product category."
                : "Distribution of unique products cataloged by category."}
            </p>
          </div>
          {categoryData.length > 0 ? (
            <div className="h-70 w-full flex flex-col items-center justify-center">
              <div className="h-45 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                    >
                      {categoryData.map((_entry, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: unknown) => [
                        value as number,
                        categoryData[0]?.isStockBased ? "Quantity" : "Products Count"
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Custom Legend */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 max-h-20 overflow-y-auto w-full text-xs">
                {categoryData.map((cat, index: number) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-slate-500 dark:text-zinc-400 truncate max-w-20" title={cat.name}>{cat.name}</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-70 w-full flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 border border-dashed rounded-2xl border-slate-200 dark:border-zinc-800">
              <p className="text-sm font-medium">No category breakdown data.</p>
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Recent Activity & Stock Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-zinc-100">Recent Activity</h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500">The latest transaction invoices recorded on your system.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/orders")} className="cursor-pointer gap-1 border-slate-200 text-slate-600 hover:text-slate-800">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-zinc-800/20 border-b border-slate-100 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  <th className="p-4">Contact</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Final Price</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order: DashboardOrder) => (
                    <tr key={order._id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/10 transition-colors">
                      <td className="p-4 font-semibold text-slate-800 dark:text-zinc-200">{order.contact?.name || "N/A"}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${order.orderType === "sell" ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50" : "bg-indigo-50 text-indigo-700 border border-indigo-100/50"
                          }`}>
                          {order.orderType === "sell" ? "Sell" : "Purchase"}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-800 dark:text-zinc-200">₹{order.finalPrice.toFixed(2)}</td>
                      <td className="p-4 text-slate-400 dark:text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      No transactions recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Alert list */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex flex-col gap-1 mb-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Stock Warnings
            </h2>
            <p className="text-xs text-slate-400 dark:text-zinc-500">Catalog items with low stock warning alerts.</p>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((prod: DashboardProduct) => (
                <div key={prod._id} className="flex items-center justify-between p-3 rounded-xl border border-amber-100/70 dark:border-amber-950/20 bg-amber-50/20 dark:bg-amber-950/5">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 dark:text-zinc-200 truncate">{prod.title}</p>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">{prod.category}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${prod.quantity <= 2 ? "bg-red-50 text-red-700 border border-red-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                    {prod.quantity} units left
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 h-full py-12 border border-dashed rounded-2xl border-slate-200 dark:border-zinc-800">
                <Package className="h-8 w-8 text-indigo-300 mb-2" />
                <p className="text-xs font-medium">All stocks healthy</p>
                <p className="text-[10px] text-slate-400">No low stock alerts.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
