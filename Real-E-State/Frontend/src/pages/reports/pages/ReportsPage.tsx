import { useNavigate, useParams } from "react-router-dom";
import { TrendingUp, Package, ShoppingCart, ShoppingBag } from "lucide-react";
import ProfitLossTab from "../components/ProfitLossTab";
import ProductsTab from "../components/ProductsTab";
import SellTab from "../components/SellTab";
import BuyTab from "../components/BuyTab";

type TabType = "profit-loss" | "products" | "sell" | "buy";

export default function ReportsPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  // Validate the tab, default to profit-loss if invalid
  const activeTab: TabType = (["profit-loss", "products", "sell", "buy"].includes(type || ""))
    ? (type as TabType)
    : "profit-loss";

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    {
      key: "profit-loss",
      label: "Profit / Loss",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      key: "products",
      label: "Products",
      icon: <Package className="h-4 w-4" />,
    },
    {
      key: "sell",
      label: "Sell Reports",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      key: "buy",
      label: "Buy Reports",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
  ];

  const switchTab = (tab: TabType) => {
    navigate(`/reports/${tab}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            View your business performance and insights
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border w-fit overflow-x-auto max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => switchTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content Area ── */}
      <div className="mt-4">
        {activeTab === 'profit-loss' && <ProfitLossTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'sell' && <SellTab />}
        {activeTab === 'buy' && <BuyTab />}
      </div>
    </div>
  );
}
