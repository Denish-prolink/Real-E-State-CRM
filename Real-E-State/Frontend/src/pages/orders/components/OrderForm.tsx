import type { AddOrderPayload, OrderItemPayload } from "../types/order.types";
import { FormLabel, SectionTitle } from "@/components/common/FormHelpers";
import { Minus, PackagePlus, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Contact } from "@/pages/contacts/types/contact.types";
import { cn } from "@/lib/utils";
import { orderSchema } from "../schemas/order.schema";
import { toast } from "sonner";
import { useFormik } from "formik";
import { useGetContacts } from "../../contacts/hooks/useGetContacts";
import { useGetProducts } from "../../products/hooks/useGetProducts";
import { useGetSkus } from "../../skus/hooks/useGetSkus";
import { useGetWarehouses } from "../../warehouses/hooks/useGetWarehouses";

interface Props {
  onSubmit: (values: AddOrderPayload) => void | Promise<void>;
  onCancel: () => void;
  orderType: "purchase" | "sell";
  isSubmitting?: boolean;
}

const EMPTY_ITEM: OrderItemPayload = {
  warehouse: "",
  product: "",
  sku: "",
  quantity: 1,
  price: 0,
  total: 0,
};

export default function OrderForm({
  onSubmit,
  onCancel,
  orderType,
  isSubmitting = false,
}: Props) {
  // Fetch data for dropdowns
  const { data: contactsResponse } = useGetContacts({});
  const contacts = useMemo(() => {
    const data = contactsResponse as { contacts: Contact[]; total: number; page: number } | undefined;
    const allContacts: Contact[] = data?.contacts || [];
    if (orderType === "sell") {
      return allContacts.filter((c) => c.type === "customer");
    } else if (orderType === "purchase") {
      return allContacts.filter((c) => c.type === "supplier");
    }
    return allContacts;
  }, [contactsResponse, orderType]);

  const { data: warehousesResponse } = useGetWarehouses();
  const warehouses = (warehousesResponse as { _id: string; warehouseName: string }[] || []);

  const { data: productsResponse } = useGetProducts();
  const products = useMemo(() => {
    const data = productsResponse?.data as { products: { _id: string; id?: string; title?: string; salePrice?: number; quantity: number; sku?: string }[] } | undefined;
    return data?.products || [];
  }, [productsResponse]);

  const { data: skusResponse } = useGetSkus();
  const skus = useMemo(() => {
    const data = skusResponse?.data as { skus: { _id: string; skuCode: string; name: string }[] } | undefined;
    return data?.skus || [];
  }, [skusResponse]);

  // Selected contact for details display
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Line items state
  const [items, setItems] = useState<OrderItemPayload[]>([{ ...EMPTY_ITEM }]);

  // Pricing state
  const [gstRate, setGstRate] = useState(18);
  const [discountType, setDiscountType] = useState<"percentage" | "amount">(
    "amount"
  );
  const [discountValue, setDiscountValue] = useState(0);

  // Calculate subtotal, GST, discount amount, and final price
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.total, 0),
    [items]
  );

  const gstAndCharges = useMemo(() => {
    return (subtotal * gstRate) / 100;
  }, [subtotal, gstRate]);

  const discountAmount = useMemo(() => {
    if (discountType === "percentage") {
      return (subtotal * discountValue) / 100;
    }
    return discountValue;
  }, [subtotal, discountType, discountValue]);

  const finalPrice = useMemo(() => {
    return Math.max(0, subtotal + gstAndCharges - discountAmount);
  }, [subtotal, gstAndCharges, discountAmount]);

  const formik = useFormik<{
    contact: string;
    items: OrderItemPayload[];
    gstAndCharges: number;
    discountType: "percentage" | "amount";
    discountValue: number;
    finalPrice: number;
    deliveryAddress: string;
  }>({
    initialValues: {
      contact: "",
      items: [{ ...EMPTY_ITEM }],
      gstAndCharges: 0,
      discountType: "amount",
      discountValue: 0,
      finalPrice: 0,
      deliveryAddress: "",
    },
    validationSchema: orderSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      if (orderType === "sell") {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const prod = products.find(
            (p: { _id: string; id?: string; title?: string; quantity: number }) => p._id === item.product || p.id === item.product
          );
          if (prod && prod.quantity < item.quantity) {
            toast.error(
              `Insufficient stock for product "${prod.title || "Selected Product"}". Available: ${prod.quantity}, Required: ${item.quantity}`
            );
            return;
          }
        }
      }
      try {
        await onSubmit({
          ...values,
          orderType,
          items,
          gstAndCharges,
          discountType,
          discountValue,
          finalPrice,
        });
        helpers.resetForm();
        setItems([{ ...EMPTY_ITEM }]);
        setDiscountType("amount");
        setDiscountValue(0);
        setSelectedContact(null);
      } catch {
        // stay open
      }
    },
  });

  const handleOrderSubmit = async () => {
    formik.setTouched({
      contact: true,
      deliveryAddress: true,
    });
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      const errorMessages: string[] = [];

      if (errors.contact) {
        errorMessages.push(errors.contact);
      }

      if (errors.items) {
        if (typeof errors.items === "string") {
          errorMessages.push(errors.items);
        } else if (Array.isArray(errors.items)) {
          errors.items.forEach((itemError, index) => {
            if (itemError && typeof itemError === "object") {
              const requiredFields: string[] = [];
              const otherErrors: string[] = [];
              const fieldLabels: Record<string, string> = {
                warehouse: "Warehouse",
                product: "Product",
                sku: "SKU",
                quantity: "Quantity",
                price: "Price",
              };

              Object.keys(itemError).forEach((key) => {
                const msg = (itemError as Record<string, unknown>)[key];
                if (typeof msg === "string") {
                  if (msg.toLowerCase().includes("is required")) {
                    requiredFields.push(fieldLabels[key] || key);
                  } else {
                    otherErrors.push(msg);
                  }
                }
              });

              if (requiredFields.length > 0) {
                errorMessages.push(
                  `Item ${index + 1}: ${requiredFields.join(", ")} ${
                    requiredFields.length > 1 ? "are" : "is"
                  } required`
                );
              }
              otherErrors.forEach((err) => {
                errorMessages.push(`Item ${index + 1}: ${err}`);
              });
            }
          });
        }
      }

      if (errors.gstAndCharges) {
        errorMessages.push(errors.gstAndCharges);
      }
      if (errors.discountValue) {
        errorMessages.push(errors.discountValue);
      }
      if (errors.finalPrice) {
        errorMessages.push(errors.finalPrice);
      }
      if (errors.deliveryAddress) {
        errorMessages.push(errors.deliveryAddress as string);
      }

      if (errorMessages.length > 0) {
        toast.error(
          <div className="flex flex-col gap-1.5 text-left">
            <span className="font-semibold text-sm">Please correct the following errors:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-xs">
              {errorMessages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        );
      }
    } else {
      formik.submitForm();
    }
  };

  // When contact is selected, find and display details
  const handleContactChange = useCallback(
    (contactId: string) => {
      formik.setFieldValue("contact", contactId);
      const found = contacts.find((c: Contact) => c._id === contactId);
      setSelectedContact(found || null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contacts]
  );

  // Sync items state to Formik values
  useEffect(() => {
    formik.setFieldValue("items", items, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Item handlers
  const updateItem = (index: number, field: keyof OrderItemPayload, value: string | number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      // Auto-recalculate total
      if (field === "quantity" || field === "price") {
        updated[index].total = updated[index].quantity * updated[index].price;
      }
      return updated;
    });
  };

  const updateItemFields = (index: number, fields: Partial<OrderItemPayload>) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...fields };
      // Auto-recalculate total
      const q = updated[index].quantity;
      const p = updated[index].price;
      updated[index].total = q * p;
      return updated;
    });
  };

  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const incrementQty = (index: number) =>
    updateItem(index, "quantity", items[index].quantity + 1);
  const decrementQty = (index: number) => {
    if (items[index].quantity > 1) {
      updateItem(index, "quantity", items[index].quantity - 1);
    }
  };

  const selectCls =
    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-colors";

  const inputCls =
    "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-6"
      noValidate
    >
      {/* ── CONTACT ── */}
      <SectionTitle>Contact Information</SectionTitle>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Contact Select */}
          <div>
            <FormLabel htmlFor="contact" required>
              Select Contact
            </FormLabel>
            <Select
              value={formik.values.contact}
              onValueChange={(val) => handleContactChange(val || "")}
            >
              <SelectTrigger className={cn("w-full h-9", selectCls)}>
                <SelectValue placeholder="Choose contact">
                  {contacts.find((c: Contact) => c._id === formik.values.contact)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="min-w-max">
                {contacts.map((c: Contact) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.errors.contact &&
              (formik.touched.contact || formik.submitCount > 0) && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.contact}
                </p>
              )}
          </div>

          {/* Contact Details */}
          <div className="sm:col-span-2">
            <FormLabel htmlFor="contactDetails">Contact Details</FormLabel>
            {selectedContact ? (
              <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {selectedContact.name}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {selectedContact.type}
                  </span>
                </div>
                {selectedContact.email && (
                  <p className="text-muted-foreground">
                    📧 {selectedContact.email}
                  </p>
                )}
                {selectedContact.mobileNo && (
                  <p className="text-muted-foreground">
                    📱 {selectedContact.mobileNo}
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-xs text-muted-foreground">
                Select a contact to view details
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <SectionTitle>Add Products</SectionTitle>
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-border bg-muted/5 p-4 flex flex-col gap-3"
          >
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
              {/* Warehouse */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Warehouse
                </label>
                <Select
                  value={item.warehouse}
                  onValueChange={(val) => updateItem(idx, "warehouse", val || "")}
                >
                  <SelectTrigger className={cn("w-full text-xs h-8", selectCls)}>
                    <SelectValue placeholder="Select">
                      {warehouses.find((w: { _id: string; warehouseName: string }) => w._id === item.warehouse)?.warehouseName}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="min-w-max">
                    {warehouses.map((w: { _id: string; warehouseName: string }) => (
                      <SelectItem key={w._id} value={w._id}>
                        {w.warehouseName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Product
                </label>
                <Select
                  value={item.product}
                  onValueChange={(val) => {
                    const prod = products.find(
                      (p: { _id: string; id?: string; title?: string; salePrice?: number; quantity: number; sku?: string }) =>
                        p._id === val || p.id === val
                    );
                    const skuVal = prod ? prod.sku || "" : "";
                    const priceVal = prod ? prod.salePrice || 0 : 0;
                    
                    updateItemFields(idx, {
                      product: val || "",
                      sku: skuVal,
                      price: priceVal,
                    });
                  }}
                >
                  <SelectTrigger className={cn("w-full text-xs h-8", selectCls)}>
                    <SelectValue placeholder="Select">
                      {products.find((p: { _id: string; id?: string; title?: string }) => p._id === item.product || p.id === item.product)?.title}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="min-w-max">
                    {products.map((p: { _id: string; id?: string; title?: string }) => (
                      <SelectItem key={p._id || p.id} value={p._id || p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* SKU (Dropdown from Sku API) */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  SKU
                </label>
                <Select
                  value={item.sku}
                  onValueChange={(val) => updateItem(idx, "sku", val || "")}
                >
                  <SelectTrigger className={cn("w-full text-xs h-8", selectCls)}>
                    <SelectValue placeholder="Select SKU">
                      {(() => {
                        const s = skus.find((s: { _id: string; skuCode: string; name: string }) => s.skuCode === item.sku);
                        return s ? `${s.skuCode} (${s.name})` : "";
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="min-w-max">
                    {skus.map((s: { _id: string; skuCode: string; name: string }) => (
                      <SelectItem key={s._id} value={s.skuCode}>
                        {s.skuCode} ({s.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Qty */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-muted-foreground block">
                    Quantity
                  </label>
                  {orderType === "sell" && item.product && (() => {
                    const prod = products.find((p: { _id: string; id?: string; quantity: number }) => p._id === item.product || p.id === item.product);
                    const stock = prod ? prod.quantity : 0;
                    return (
                      <span className={cn("text-[10px] font-semibold whitespace-nowrap", 
                        item.quantity > stock ? "text-red-500 font-bold" : "text-muted-foreground"
                      )}>
                        Stock: {stock}
                      </span>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => decrementQty(idx)}
                    className="h-8 w-8 shrink-0 flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        idx,
                        "quantity",
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    className={cn(
                      inputCls,
                      "text-xs h-8 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => incrementQty(idx)}
                    className="h-8 w-8 shrink-0 flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Price (₹)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.price !== undefined && item.price !== null ? item.price : ""}
                    onChange={(e) =>
                      updateItem(
                        idx,
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    className={cn(inputCls, "text-xs h-8")}
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="h-8 w-8 shrink-0 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Line total */}
            <div className="text-right text-xs text-muted-foreground">
              Line total:{" "}
              <span className="font-semibold text-foreground">
                ₹{item.total.toFixed(2)}
              </span>
            </div>
          </div>
        ))}

        {/* Add product button */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2 px-3 rounded-lg border border-dashed border-indigo-300 hover:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/20 transition-colors cursor-pointer w-fit"
          >
            <PackagePlus className="h-4 w-4" />
            Add another product
          </button>
          {/* {typeof formik.errors.items === "string" && (
            <p className="text-xs text-red-500 font-semibold mt-1">
              ⚠️ {formik.errors.items}
            </p>
          )} */}
        </div>
      </div>

      {/* ── PRICING ── */}
      <SectionTitle>Pricing Summary</SectionTitle>
      <div className="flex flex-col gap-3">
        {/* Subtotal display */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-sm text-muted-foreground whitespace-nowrap">
            GST & Other Charges
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={gstRate !== undefined && gstRate !== null ? gstRate : ""}
                onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                placeholder="18"
                className={cn(inputCls, "w-24 pr-6 text-right")}
              />
              <span className="absolute right-2 text-xs text-muted-foreground">%</span>
            </div>
            <span className="font-medium min-w-24 text-right">
              ₹{gstAndCharges.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Discount */}
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm text-muted-foreground whitespace-nowrap">
            Discount
          </label>
          <div className="flex items-center gap-2">
            <Select
              value={discountType}
              onValueChange={(val) =>
                setDiscountType(
                  val as "percentage" | "amount"
                )
              }
            >
              <SelectTrigger className={cn("w-20 text-xs h-9", selectCls)}>
                <SelectValue placeholder="%" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">%</SelectItem>
                <SelectItem value="amount">₹</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="number"
              min={0}
              step="0.01"
              value={discountValue !== undefined && discountValue !== null ? discountValue : ""}
              onChange={(e) =>
                setDiscountValue(parseFloat(e.target.value) || 0)
              }
              placeholder="0.00"
              className={cn(inputCls, "w-28 text-right")}
            />
          </div>
        </div>

        {/* Discount amount display */}
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Discount Amount</span>
            <span className="font-medium text-red-500">
              -₹{discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Final Price */}
        <div className="flex items-center justify-between text-base pt-2 border-t border-border">
          <span className="font-semibold">Final Price</span>
          <span className="text-lg font-bold text-indigo-600">
            ₹{finalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* ── DELIVERY ADDRESS ── */}
      <SectionTitle>Delivery Address</SectionTitle>
      <div>
        <textarea
          id="deliveryAddress"
          name="deliveryAddress"
          rows={3}
          placeholder="Enter delivery address..."
          value={formik.values.deliveryAddress}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
        />
      </div>

      {/* ── ACTIONS ── */}
      <div className="border-t border-border pt-4 flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleOrderSubmit}
          disabled={formik.isSubmitting || isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-30"
        >
          {formik.isSubmitting || isSubmitting
            ? "Saving..."
            : "Submit Order"}
        </Button>
      </div>
    </form>
  );
}
