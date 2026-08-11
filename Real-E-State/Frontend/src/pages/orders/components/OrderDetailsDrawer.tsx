import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { Order } from "../types/order.types";
import { printOrder } from "../utils/printOrder";

interface OrderDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderDetailsDrawer({
  open,
  onClose,
  order,
}: OrderDetailsDrawerProps) {
  if (!order) return null;

  const discountAmount =
    order.discountType === "percentage"
      ? (order.items.reduce((sum, item) => sum + item.total, 0) * order.discountValue) / 100
      : order.discountValue;

  const subtotal = order.items.reduce((sum, item) => sum + item.total, 0);

  const handlePrint = () => {
    printOrder(order);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-5xl overflow-y-auto p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg font-bold">
                  Order Details
                </SheetTitle>
              </div>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Type: {order.orderType === "sell" ? "Sell Order" : "Purchase Order"} | Date:{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 p-3 space-y-6">
          {/* Contact Details Card */}
          <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-semibold text-foreground">{order.contact?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contact Type</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/45 dark:text-indigo-400 border border-indigo-100">
                  {order.contact?.type || "N/A"}
                </span>
              </div>
              {order.contact?.email && (
                <div>
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="text-foreground">📧 {order.contact.email}</p>
                </div>
              )}
              {order.contact?.mobileNo && (
                <div>
                  <p className="text-xs text-muted-foreground">Mobile Number</p>
                  <p className="text-foreground">📱 {order.contact.mobileNo}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Items Ordered
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

          {/* Pricing Details */}
          <div className="rounded-xl border border-border bg-muted/5 p-4 space-y-2 text-sm max-w-sm ml-auto">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST & Other Charges</span>
              <span className="font-medium text-foreground">₹{order.gstAndCharges.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Discount ({order.discountType === "percentage" ? `${order.discountValue}%` : "₹"})</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
              <span>Final Price</span>
              <span className="text-indigo-600">₹{order.finalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Address */}
          {order.deliveryAddress && (
            <div className="rounded-xl border border-border p-4 space-y-2 text-sm bg-muted/5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Delivery Address
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {order.deliveryAddress}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-3 mt-auto">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
