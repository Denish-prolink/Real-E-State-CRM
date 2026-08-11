import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreVertical,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Product } from "../types/product.types";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { getImageUrl } from "@/lib/utils";

interface Props {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
  startIndex: number;
}

export default function ProductTable({
  products,
  isLoading,
  onEdit,
  onDelete,
  onView,
  startIndex,
}: Props) {
  return (
    <div className={products.length > 0 ? " overflow-hidden shadow-sm" : "rounded-xl border border-border bg-card overflow-hidden shadow-sm"}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Raw Price</TableHead>
              <TableHead>Sale Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={10} />
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Package className="h-10 w-10 text-muted-foreground/30" />
                    <p className="font-medium">No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>{startIndex + index + 1}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.title || "Product"}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="h-4 w-4" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-sm">
                          {product.title || "-"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{product.category || "-"}</TableCell>

                  <TableCell>{product.quantity ?? "-"}</TableCell>

                  <TableCell>
                    {product.rawPrice != null ? `₹${product.rawPrice}` : "-"}
                  </TableCell>

                  <TableCell>
                    {product.salePrice != null ? `₹${product.salePrice}` : "-"}
                  </TableCell>

                  <TableCell>{product.status || "-"}</TableCell>

                  <TableCell>
                    {Array.isArray(product.supplier)
                      ? product.supplier.join(", ")
                      : product.supplier || "-"}
                  </TableCell>

                  <TableCell>
                    {product.expiryDate
                      ? new Date(product.expiryDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      : "-"}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2 justify-start items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted cursor-pointer transition-colors">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 rounded-lg">
                          <DropdownMenuItem onClick={() => onView(product)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit(product)} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete(product.id)} className="cursor-pointer text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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