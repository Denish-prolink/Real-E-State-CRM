import { Package, Pencil, Tag, Trash2 } from "lucide-react";
import { TruncatedName } from "@/components/common/TruncatedName";

import type { Sku } from "../types/sku.types";

interface Props {
  skus: Sku[];
  isLoading: boolean;
  onEdit: (sku: Sku) => void;
  onDelete: (id: string) => void;
}

export default function SkuGrid({
  skus,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6 shadow-sm animate-pulse flex flex-col gap-4"
          >
            <div className="h-10 w-10 bg-muted rounded-lg"></div>
            <div className="h-5 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-full bg-muted rounded mt-2"></div>
            <div className="h-4 w-5/6 bg-muted rounded"></div>
            <div className="mt-auto pt-4 flex gap-2">
              <div className="h-8 w-8 bg-muted rounded"></div>
              <div className="h-8 w-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (skus.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-xl border-dashed">
        <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="font-medium text-lg">No SKUs found</p>
        <p className="text-muted-foreground mt-1 text-sm">Add a new SKU to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {skus.map((sku) => (
        <div
          key={sku._id}
          className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-500/30 overflow-hidden"
        >
          {/* Subtle gradient background effect on hover */}
          <div className="absolute inset-0 from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Tag className="h-5 w-5" />
              </div>
               <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">
              {sku.skuCode}
            </p>
            </div>
            
            <div className="flex items-center gap-1 opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(sku)}
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-300 dark:hover:bg-indigo-500/30 transition-colors"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(sku._id)}
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col">
            <TruncatedName name={sku.name} maxLength={15} className="text-lg font-semibold tracking-tight text-foreground mb-1" />
           
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
              {sku.description || "No description provided."}
            </p>
          </div>
          
          <div className="relative z-10 flex items-center pt-4 border-t border-border/50 justify-between">
            {/* <span className="text-xs font-medium text-muted-foreground">
              ID: {sku._id.substring(sku._id.length - 6)}
            </span> */}
            <span className="text-xs font-medium px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md">
              {sku.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
