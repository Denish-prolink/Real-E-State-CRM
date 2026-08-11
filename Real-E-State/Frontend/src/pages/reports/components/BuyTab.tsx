import { useMemo } from 'react';
import { useGetBuyReport } from '../hooks/useGetReports';
import { Loader2, ShoppingBag, Calendar } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getMonthName = (month: number) => {
  return MONTH_NAMES[month - 1] || '';
};

export default function BuyTab() {
  const { data, isLoading } = useGetBuyReport();

  const reports = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  
  const { totalCost, totalOrders } = useMemo(() => {
    return reports.reduce(
      (acc, curr) => ({
        totalCost: acc.totalCost + curr.cost,
        totalOrders: acc.totalOrders + curr.ordersCount,
      }),
      { totalCost: 0, totalOrders: 0 }
    );
  }, [reports]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-950 border border-border rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center mb-4">
            <ShoppingBag className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Total Lifetime Purchases</p>
          <p className="text-2xl font-bold mt-1">₹{totalCost.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-border rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Total Purchase Orders</p>
          <p className="text-2xl font-bold mt-1">{totalOrders}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-border rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Monthly Purchase Breakdown</h3>
        <div className="space-y-3">
          {reports.map((r: { _id: { year: number; month: number }; ordersCount: number; cost: number }) => (
            <div key={`${r._id.year}-${r._id.month}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-muted/50 border border-border/50 gap-2">
               <span className="font-medium text-sm flex items-center gap-2">
                 <Calendar className="h-4 w-4 text-muted-foreground" />
                 {getMonthName(r._id.month)} {r._id.year}
               </span>
               <div className="flex items-center justify-between sm:justify-end gap-6 text-sm w-full sm:w-auto">
                 <span className="text-muted-foreground">{r.ordersCount} orders</span>
                 <span className="font-bold text-foreground">₹{r.cost.toLocaleString()}</span>
               </div>
            </div>
          ))}
          {reports.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No purchase data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
