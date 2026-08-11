import { ShoppingCart, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TruncatedName } from "@/components/common/TruncatedName";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import type { Order } from "../types/order.types";

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  onView: (order: Order) => void;
  startIndex?: number;
}

export default function OrderTable({
  orders,
  isLoading,
  onView,
  startIndex = 0,
}: OrderTableProps) {

  return (
    <div className={orders.length > 0 ? "rounded-xl border border-border bg-card overflow-hidden shadow-sm" : " overflow-hidden shadow-sm"}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="flex-1">Contact</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Final Price</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={6} />
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <ShoppingCart className="h-10 w-10 text-muted-foreground/30" />
                    <p className="font-medium text-muted-foreground">
                      No orders found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => (
                <TableRow
                  key={order._id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <TruncatedName
                        name={order.contact?.name || "N/A"}
                        className="font-semibold text-sm"
                      />
                      <span className="text-xs text-muted-foreground">
                        {order.contact?.mobileNo || ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted/50 border">
                      {order.items?.length || 0}{" "}
                      {(order.items?.length || 0) === 1 ? "item" : "items"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-sm">
                      ₹{order.finalPrice?.toFixed(2) || "0.00"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onView(order)}
                        className="p-1.5 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-md transition-colors"
                        title="View Order Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {/* <button
                        onClick={() => onDelete(order._id)}
                        className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
