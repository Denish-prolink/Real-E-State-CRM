import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export default function TablePagination({
  currentPage,
  totalItems,
  pageSize = 10,
  onPageChange,
  itemLabel = "items",
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  if (totalItems <= pageSize) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <p className="text-sm text-muted-foreground">
        Showing {startIndex + 1}–{endIndex} of {totalItems} {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        {/* Double Previous — First Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={safePage === 1}
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous — 1 page back */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          disabled={safePage === 1}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-sm text-muted-foreground">…</span>
          ) : (
            <Button
              key={page}
              variant={safePage === page ? "default" : "outline"}
              size="icon"
              className={`h-8 w-8 text-xs ${safePage === page ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          )
        )}

        {/* Next — 1 page forward */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
          disabled={safePage === totalPages}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Double Next — Last Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={safePage === totalPages}
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
