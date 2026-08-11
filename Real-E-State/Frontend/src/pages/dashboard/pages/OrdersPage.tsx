import { Search, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const orders = [
    { id: "ORD-9021", customer: "Acme Corp", date: "June 14, 2026", items: 4, total: "$624.50", status: "Delivered" },
    { id: "ORD-9022", customer: "Globals Inc", date: "June 13, 2026", items: 2, total: "$89.90", status: "Processing" },
    { id: "ORD-9023", customer: "Retail Hub", date: "June 11, 2026", items: 10, total: "$1,890.00", status: "Pending" },
    { id: "ORD-9024", customer: "Tech Solution", date: "June 10, 2026", items: 1, total: "$349.00", status: "Delivered" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Warehouse Orders</h1>
        <p className="text-muted-foreground text-sm">
          Track inbound stock orders and outbound client deliveries.
        </p>
      </div>

      <div className="flex gap-4 items-center bg-card p-4 rounded-xl border border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Recipient</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-center">Items</th>
                <th className="p-4 font-medium text-right">Total Amount</th>
                <th className="p-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-semibold font-mono text-indigo-600 dark:text-indigo-400">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      {order.id}
                    </div>
                  </td>
                  <td className="p-4">{order.customer}</td>
                  <td className="p-4 text-muted-foreground">{order.date}</td>
                  <td className="p-4 text-center font-medium">{order.items}</td>
                  <td className="p-4 text-right font-medium">{order.total}</td>
                  <td className="p-4 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      order.status === "Delivered" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      order.status === "Processing" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
