import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, ShoppingBag, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import OrderTable from "../components/OrderTable";
import TablePagination from "@/components/common/TablePagination";
import { useGetOrders } from "../hooks/useGetOrders";
import { useDeleteOrder } from "../hooks/useDeleteOrder";
import { useDebounce } from "@/hooks/useDebounce";
import type { Order } from "../types/order.types";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";

type TabType = "sell" | "purchase";

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active tab from the URL
  const activeTab: TabType = location.pathname.includes("/purchase")
    ? "purchase"
    : "sell";

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch orders filtered by tab type & search query
  const { data: apiResponse, isLoading, isFetching } = useGetOrders({
    page: currentPage,
    perPage: PAGE_SIZE,
    orderType: activeTab,
    search: debouncedSearch || undefined,
  });

  const data = apiResponse as { orders: Order[]; total: number; page: number } | undefined;
  const orders = data?.orders || [];
  const total = data?.total || 0;

  const deleteMutation = useDeleteOrder();

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteMutation.mutateAsync(deleteId);
        toast.success("Order deleted successfully");
        setDeleteId(null);
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || "Failed to delete order");
      }
    }
  };

  // Switch tab by navigating
  const switchTab = (tab: TabType) => {
    setCurrentPage(1);
    setSearch("");
    navigate(`/orders/${tab}`);
  };

  // Reset page when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    {
      key: "sell",
      label: "Sell Orders",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      key: "purchase",
      label: "Purchase Orders",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {total} total {activeTab === "sell" ? "sell" : "purchase"} orders
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => navigate(`/orders/${activeTab}/create`)}
          >
            <Plus className="h-4 w-4" />
            New {activeTab === "sell" ? "Sell" : "Purchase"} Order
          </Button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => switchTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Search bar ── */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by contact name..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <OrderTable
            orders={orders}
            isLoading={isLoading || isFetching}
            onView={(order) => navigate(`/orders/${activeTab}/${order._id}`)}
            startIndex={(currentPage - 1) * PAGE_SIZE}
          />
        </div>

        {/* Pagination */}
        {!(isLoading || isFetching) && (
          <TablePagination
            currentPage={currentPage}
            totalItems={total}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="orders"
          />
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && !deleteMutation.isPending && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title="Delete Order"
        description="Are you sure you want to permanently delete this order? This action cannot be undone."
      />
    </div>
  );
}
