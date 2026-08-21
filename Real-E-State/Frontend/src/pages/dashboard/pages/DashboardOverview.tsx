import { LayoutDashboard } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-6 p-6 min-h-full bg-[#f8fafc] dark:bg-zinc-950/20">
      <div className="relative overflow-hidden bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/25">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none">
          <LayoutDashboard className="h-64 w-64" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-sm">
            ✨ Control Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Real-E-State <span className="text-blue-500">CRM</span></h2>
          <p className="text-indigo-200/80 text-sm leading-relaxed">
            Welcome to the empty dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
