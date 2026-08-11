import { Layers, Pencil, Trash2 } from "lucide-react";
import { TruncatedName } from "@/components/common/TruncatedName";

import type { Category } from "../types/category.types";

interface Props {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export default function CategoryGrid({
  categories,
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

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-xl border-dashed">
        <Layers className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="font-medium text-lg">No categories found</p>
        <p className="text-muted-foreground mt-1 text-sm">Add a new category to get started.</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <div
          key={category._id}
          className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-500/30 overflow-hidden"
        >
          {/* Subtle gradient background effect on hover */}
          <div className="absolute inset-0  from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                {getInitials(category.name)}
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(category)}
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-300 dark:hover:bg-indigo-500/30 transition-colors"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(category._id)}
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col">
            <TruncatedName name={category.name} maxLength={15} className="text-lg font-semibold tracking-tight text-foreground mb-1" />
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
              {category.description || "No description provided."}
            </p>
          </div>
          
          
        </div>
      ))}
    </div>
  );
}
