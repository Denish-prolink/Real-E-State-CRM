import { useNavigate, useParams } from "react-router-dom";
import { useAddOrder } from "../hooks/useAddOrder";
import { toast } from "sonner";
import OrderForm from "../components/OrderForm";
import type { AddOrderPayload } from "../types/order.types";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateOrderPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const addMutation = useAddOrder();

  const orderType = type === "purchase" ? "purchase" : "sell";

  const handleAdd = async (values: AddOrderPayload) => {
    try {
      const response = await addMutation.mutateAsync(values);
      toast.success(response?.message || "Order created successfully");
      navigate(`/orders/${orderType}`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to create order");
      throw err;
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Back Button & Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={() => navigate(`/orders/${orderType}`)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create {orderType === "sell" ? "Sell" : "Purchase"} Order
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {orderType === "sell"
              ? "Create a new sell order for a customer."
              : "Create a new purchase order from a supplier."}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <OrderForm
          onSubmit={handleAdd}
          onCancel={() => navigate(`/orders/${orderType}`)}
          orderType={orderType}
          isSubmitting={addMutation.isPending}
        />
      </div>
    </div>
  );
}
