import { useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight, Loader2, TrendingUp, TrendingDown } from 'lucide-react';

import { useGetProfitLoss } from '../hooks/useGetReports';

interface ProfitLossData {
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  sellOrdersCount: number;
  buyOrdersCount: number;
}

export default function ProfitLossTab() {
  const { data, isLoading } = useGetProfitLoss();

  const { revenue, cost, profit, isPositive, profitMargin } = useMemo(() => {
    const reportData = data as ProfitLossData | undefined;
    const r = reportData?.totalRevenue || 0;
    const c = reportData?.totalCost || 0;
    const p = reportData?.netProfit || 0;
    return {
      revenue: r,
      cost: c,
      profit: p,
      isPositive: p >= 0,
      profitMargin: r > 0 ? (p / r) * 100 : 0
    };
  }, [data]);

  const reportData = data as ProfitLossData | undefined;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Simple, Clean 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Revenue Card */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Total Revenue</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-4 text-slate-800 dark:text-zinc-100">
              ₹{revenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs">
            <span className="text-slate-400 dark:text-zinc-500">{reportData?.sellOrdersCount || 0} sell orders</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-medium">Sales</span>
          </div>
        </div>

        {/* Cost Card */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Total Cost</span>
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
                <ArrowDownRight className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-4 text-slate-800 dark:text-zinc-100">
              ₹{cost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs">
            <span className="text-slate-400 dark:text-zinc-500">{reportData?.buyOrdersCount || 0} purchase orders</span>
            <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-medium">Expenses</span>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                {isPositive ? "Net Profit" : "Net Loss"}
              </span>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                isPositive ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-rose-50 dark:bg-rose-950/30"
              }`}>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                )}
              </div>
            </div>
            <h3 className={`text-2xl font-bold mt-4 ${
              isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}>
              {isPositive ? "+" : "-"}₹{Math.abs(profit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs">
            <span className="text-slate-400 dark:text-zinc-500">Margin ratio</span>
            <span className={`px-2 py-0.5 rounded font-medium ${
              isPositive 
                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400" 
                : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
            }`}>
              {profitMargin.toFixed(1)}% Margin
            </span>
          </div>
        </div>
      </div>

      {/* Simple Information Footer */}
      {/* <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-500 pl-1">
        <Landmark className="h-3.5 w-3.5" />
        <span>Financial summary generated automatically from system sales and purchase logs.</span>
      </div> */}
    </div>
  );
}
