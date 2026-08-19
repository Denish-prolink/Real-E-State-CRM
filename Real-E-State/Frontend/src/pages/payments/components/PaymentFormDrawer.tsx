import type { AddPaymentPayload, Payment } from "../types/payment.types";
import { FieldError, FormLabel, SectionTitle } from "@/components/common/FormHelpers";
import { getInputClassName } from "@/components/common/formUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { paymentSchema } from "../schemas/payment.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetPaymentById } from "../hooks/usePayments";
import { useGetBuyers } from "../../buyers/hooks/useGetBuyers";
import { useGetBookings } from "../../bookings/hooks/useBookings";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddPaymentPayload) => void | Promise<void>;
  paymentToEdit?: Payment | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddPaymentPayload = {
  paymentId: "",
  bookingId: "",
  customerId: "",
  amount: 0,
  paymentDate: new Date().toISOString().split('T')[0],
  paymentMethod: "Cash",
  transactionId: "",
  paymentType: "",
  status: "Pending",
  receipt: "",
  notes: "",
};

export default function PaymentFormDrawer({
  open,
  onClose,
  onSubmit,
  paymentToEdit,
  isSubmitting = false,
}: Props) {
  const { data: fetchedPayment, isLoading: isFetching } = useGetPaymentById(
    paymentToEdit?._id || ""
  );

  const { data: buyersApi = {} as any } = useGetBuyers(); const buyers = buyersApi?.data?.buyers || buyersApi?.buyers || (Array.isArray(buyersApi) ? buyersApi : []);
  const { data: bookings = [] } = useGetBookings();

  const formik = useFormik<AddPaymentPayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: paymentSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        const payload = { ...values };
        if (!payload.paymentId) delete payload.paymentId;
        if (!payload.bookingId) delete payload.bookingId;
        if (!payload.customerId) delete payload.customerId;
        if (!payload.paymentDate) delete payload.paymentDate;
        if (!payload.transactionId) delete payload.transactionId;
        if (!payload.paymentType) delete payload.paymentType;
        if (!payload.receipt) delete payload.receipt;
        if (!payload.notes) delete payload.notes;

        await onSubmit(payload);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (paymentToEdit) {
        const pData = fetchedPayment || paymentToEdit;
        formik.resetForm({
          values: {
            paymentId: pData.paymentId || "",
            bookingId: typeof pData.bookingId === "object" ? pData.bookingId?._id : (pData.bookingId || ""),
            customerId: typeof pData.customerId === "object" ? pData.customerId?._id : (pData.customerId || ""),
            amount: pData.amount || 0,
            paymentDate: pData.paymentDate ? new Date(pData.paymentDate).toISOString().split('T')[0] : "",
            paymentMethod: pData.paymentMethod || "Cash",
            transactionId: pData.transactionId || "",
            paymentType: pData.paymentType || "",
            status: pData.status || "Pending",
            receipt: pData.receipt || "",
            notes: pData.notes || "",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, paymentToEdit, fetchedPayment]);

  const inputCls = (field: keyof AddPaymentPayload) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {paymentToEdit ? "Edit Payment" : "Record Payment"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {paymentToEdit
                  ? "Update the details of the payment record."
                  : "Record a new payment for a booking."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="flex-1 px-6 pt-4 flex flex-col gap-5 relative pb-6" noValidate>
          {isFetching && (
            <div className="absolute inset-0 bg-background/50 z-20 flex items-center justify-center min-h-75">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}

          <SectionTitle>Payment Reference</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="bookingId">Associated Booking</FormLabel>
              <Select
                value={formik.values.bookingId}
                onValueChange={(val) => formik.setFieldValue("bookingId", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("bookingId"))}>
                  <SelectValue placeholder="Select Booking" />
                </SelectTrigger>
                <SelectContent>
                  {bookings.map((booking) => (
                    <SelectItem key={booking._id} value={booking._id}>
                      {booking.bookingNumber || booking._id} 
                      {typeof booking.customerId === 'object' && booking.customerId 
                        ? ` - ${booking.customerId.firstName} ${booking.customerId.lastName}` 
                        : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <FormLabel htmlFor="customerId">Customer</FormLabel>
              <Select
                value={formik.values.customerId}
                onValueChange={(val) => formik.setFieldValue("customerId", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("customerId"))}>
                  <SelectValue placeholder="Select Customer" />
                </SelectTrigger>
                <SelectContent>
                  {buyers.map((buyer: any) => (
                    <SelectItem key={buyer._id} value={buyer._id}>
                      {buyer.firstName} {buyer.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <FormLabel htmlFor="paymentId">Receipt/Payment ID</FormLabel>
              <Input
                id="paymentId"
                name="paymentId"
                placeholder="e.g. REC-001"
                value={formik.values.paymentId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("paymentId")}
              />
              <FieldError error={formik.errors.paymentId} touched={formik.touched.paymentId} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Transaction Details</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="amount" required>Amount (₹)</FormLabel>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formik.values.amount || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("amount")}
              />
              <FieldError error={formik.errors.amount} touched={formik.touched.amount} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="paymentDate">Payment Date</FormLabel>
              <Input
                id="paymentDate"
                name="paymentDate"
                type="date"
                value={formik.values.paymentDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("paymentDate")}
              />
              <FieldError error={formik.errors.paymentDate} touched={formik.touched.paymentDate} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="paymentMethod">Payment Method</FormLabel>
              <Select
                value={formik.values.paymentMethod}
                onValueChange={(val) => formik.setFieldValue("paymentMethod", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("paymentMethod"))}>
                  <SelectValue placeholder="Select Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <FormLabel htmlFor="paymentType">Payment Type</FormLabel>
              <Input
                id="paymentType"
                name="paymentType"
                placeholder="e.g. Advance, Installment"
                value={formik.values.paymentType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("paymentType")}
              />
              <FieldError error={formik.errors.paymentType} touched={formik.touched.paymentType} submitCount={formik.submitCount} />
            </div>
            
            <div>
              <FormLabel htmlFor="transactionId">Transaction ID/Cheque No</FormLabel>
              <Input
                id="transactionId"
                name="transactionId"
                placeholder="e.g. TXN-998877"
                value={formik.values.transactionId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("transactionId")}
              />
              <FieldError error={formik.errors.transactionId} touched={formik.touched.transactionId} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="status">Status</FormLabel>
              <Select
                value={formik.values.status}
                onValueChange={(val) => formik.setFieldValue("status", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("status"))}>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Success">Success</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <SectionTitle>Additional Information</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FormLabel htmlFor="notes">Notes</FormLabel>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Remarks about this payment..."
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  inputCls("notes")
                )}
              />
              <FieldError error={formik.errors.notes} touched={formik.touched.notes} submitCount={formik.submitCount} />
            </div>
          </div>

          <div className="sticky bottom-0 bg-card border-t border-border -mx-6 px-6 py-4 mt-auto flex gap-3 justify-end z-10 shadow-lg">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                formik.resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-30"
            >
              {formik.isSubmitting || isSubmitting
                ? "Saving..."
                : paymentToEdit
                ? "Update Payment"
                : "Record Payment"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
