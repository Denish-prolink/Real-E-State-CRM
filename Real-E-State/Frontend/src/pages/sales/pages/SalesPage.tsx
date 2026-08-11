import { TrendingUp } from "lucide-react";

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your sales channels and reports.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-16 border rounded-xl bg-card border-border border-dashed mt-4">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <TrendingUp className="h-10 w-10 text-muted-foreground/30" />
          <p className="font-medium">Sales Management Coming Soon</p>
          <p className="text-xs">This section is currently under development.</p>
        </div>
      </div>
    </div>
  );
}
