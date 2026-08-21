import { useMemo } from 'react';
import { useGetProductsReport } from '../hooks/useGetReports';
import { Loader2, Package, IndianRupee } from 'lucide-react';

interface ProductsReportSummary {
  totalProducts: number;
  totalQuantity: number;
  totalInventoryValue: number;
}
interface ProductsReportByCategory {
  _id: string;
  count: number;
  totalQuantity: number;
}
interface ProductsReportData {
  summary: ProductsReportSummary;
  byCategory: ProductsReportByCategory[];
}

export default function ProductsTab() {
  const { data, isLoading } = useGetProductsReport();

  const { summary, categories } = useMemo(() => {
    const reportData = data as ProductsReportData | undefined;
    return {
      summary: reportData?.summary || { totalProducts: 0, totalQuantity: 0, totalInventoryValue: 0 },
      categories: reportData?.byCategory || []
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-950 border border-border rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Total Products</p>
          <p className="text-2xl font-bold mt-1">{summary.totalProducts}</p>
          <p className="text-xs text-muted-foreground mt-2">{summary.totalQuantity} items in stock</p>
        </div>


        <div className="bg-white dark:bg-zinc-950 border border-border rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mb-4">
            <IndianRupee className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
          <p className="text-2xl font-bold mt-1">₹{summary.totalInventoryValue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">Based on raw cost price</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-border rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Inventory by Category</h3>
        <div className="space-y-3">
          {categories.map((c: { _id: string; count: number; totalQuantity: number }) => (
            <div key={c._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-muted/50 border border-border/50 gap-2">
              <span className="font-medium text-sm truncate max-w-full">{c._id}</span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{c.count} distinct products</span>
                <span className="font-semibold text-foreground">{c.totalQuantity} units</span>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No category data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
