import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, IndianRupee, Printer, User, Shield, MapPin, Loader2, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useGetOrderById } from "../hooks/useGetOrderById";
import { useDeleteOrder } from "../hooks/useDeleteOrder";
import { printOrder } from "../utils/printOrder";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";

export default function OrderDetailsPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: order, isLoading, error } = useGetOrderById(id || null);

  const deleteOrderMutation = useDeleteOrder();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 min-h-full items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
        <p className="text-muted-foreground text-sm">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col gap-4 p-6 min-h-full items-center justify-center">
        <p className="text-red-500 font-medium">Failed to load order or order not found.</p>
        <Button onClick={() => navigate(`/orders/${type || "sell"}`)} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Button>
      </div>
    );
  }

  const discountAmount =
    order.discountType === "percentage"
      ? (order.items.reduce((sum, item) => sum + item.total, 0) * order.discountValue) / 100
      : order.discountValue;

  const subtotal = order.items.reduce((sum, item) => sum + item.total, 0);

  const handlePrint = () => {
    printOrder(order);
  };

  const handleDelete = async () => {
    try {
      await deleteOrderMutation.mutateAsync(order._id);
      toast.success("Order deleted successfully");
      setShowDeleteConfirm(false);
      navigate(`/orders/${type || "sell"}`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(error?.response?.data?.message || error.message || "Failed to delete order");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full max-w-4xl mx-auto">
      {/* Back button and Action Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate(`/orders/${type || "sell"}`)}
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Button>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" /> Print Order
          </Button>
          {/* <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted cursor-pointer">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-lg">
              <DropdownMenuItem onClick={() => setShowDeleteConfirm(true)} className="cursor-pointer text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-xl shrink-0 border border-indigo-100 dark:border-indigo-800">
          📄
        </div>
        <div className="text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
            <h1 className="text-xl font-bold tracking-tight text-foreground truncate">
              Order Details
            </h1>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
              {order.orderType === "sell" ? "Sell Order" : "Purchase Order"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Order ID: <span className="font-semibold text-foreground">{order._id}</span> | Date:{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Details Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Details Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-500" /> Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-semibold text-foreground mt-0.5">{order.contact?.name || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Contact Type</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/45 dark:text-indigo-400 border border-indigo-100 mt-0.5">
                  {order.contact?.type || "N/A"}
                </span>
              </div>
            </div>
            {order.contact?.mobileNo && (
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Mobile Number</p>
                  <p className="font-semibold text-foreground mt-0.5">{order.contact.mobileNo}</p>
                </div>
              </div>
            )}
            {order.contact?.email && (
              <div className="flex items-start gap-2 min-w-0">
                <Mail className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="font-semibold text-foreground mt-0.5 break-all">{order.contact.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-500" /> Delivery Address
          </h3>
          <p className="text-foreground leading-relaxed text-sm whitespace-pre-wrap">
            {order.deliveryAddress || "No delivery address specified."}
          </p>
        </div>

        {/* Items Ordered Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-500" /> Items Ordered
          </h3>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground">
                  <th className="p-3">Product</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {order.items?.map((item, index) => (
                  <tr key={index} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">
                      {(item.product as { title?: string } | null)?.title || "Unknown Product"}
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">{item.sku || "-"}</td>
                    <td className="p-3 text-muted-foreground">{item.quantity}</td>
                    <td className="p-3 text-right text-muted-foreground">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-semibold text-foreground">
                      ₹{item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Summary Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-indigo-500" /> Pricing Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground font-medium">Subtotal</span>
              <span className="font-semibold text-foreground">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground font-medium">GST & Other Charges (18%)</span>
              <span className="font-semibold text-foreground">₹{order.gstAndCharges.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center py-1 text-red-500">
                <span className="font-medium">Discount ({order.discountType === "percentage" ? `${order.discountValue}%` : "₹"})</span>
                <span className="font-semibold">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-border pt-3 text-base font-bold text-foreground">
              <span>Final Price</span>
              <span className="text-indigo-600 text-lg">₹{order.finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={(val) => !val && !deleteOrderMutation.isPending && setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isPending={deleteOrderMutation.isPending}
        title="Delete Order"
        description={`Are you sure you want to permanently delete this order (ID: ${order._id})? This action cannot be undone.`}
      />
    </div>
  );
}
