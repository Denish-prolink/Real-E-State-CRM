import type { AddBookingPayload, Booking } from "../types/booking.types";
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
import { bookingSchema } from "../schemas/booking.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetBookingById } from "../hooks/useBookings";
import { useGetBuyers } from "../../buyers/hooks/useGetBuyers";
import { useGetProjects } from "../../projects/hooks/useProjects";
import { useGetProperties } from "../../properties/hooks/useProperties";
import { useGetUnits } from "../../units/hooks/useUnits";
import { useGetEmployees } from "../../employees/hooks/useGetEmployees";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddBookingPayload) => void | Promise<void>;
  bookingToEdit?: Booking | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddBookingPayload = {
  bookingNumber: "",
  customerId: "",
  propertyId: "",
  projectId: "",
  unitId: "",
  agentId: "",
  bookingDate: new Date().toISOString().split('T')[0],
  bookingAmount: 0,
  totalAmount: 0,
  discount: 0,
  tax: 0,
  finalAmount: 0,
  paymentStatus: "Pending",
  bookingStatus: "Pending",
  notes: "",
};

export default function BookingFormDrawer({
  open,
  onClose,
  onSubmit,
  bookingToEdit,
  isSubmitting = false,
}: Props) {
  const { data: fetchedBooking, isLoading: isFetching } = useGetBookingById(
    bookingToEdit?._id || ""
  );

  const { data: buyersApi = {} as any } = useGetBuyers(); const buyers = buyersApi?.data?.buyers || buyersApi?.buyers || (Array.isArray(buyersApi) ? buyersApi : []);
  const { data: projects = [] } = useGetProjects();
  const { data: properties = [] } = useGetProperties();
  const { data: units = [] } = useGetUnits();
  const { data: agentsApi = {} as any } = useGetEmployees(); const agents = agentsApi?.data?.employees || agentsApi?.employees || (Array.isArray(agentsApi) ? agentsApi : []);

  const formik = useFormik<AddBookingPayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: bookingSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        const payload = { ...values };
        if (!payload.bookingNumber) delete payload.bookingNumber;
        if (!payload.customerId) delete payload.customerId;
        if (!payload.propertyId) delete payload.propertyId;
        if (!payload.projectId) delete payload.projectId;
        if (!payload.unitId) delete payload.unitId;
        if (!payload.agentId) delete payload.agentId;
        if (!payload.bookingDate) delete payload.bookingDate;
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
      if (bookingToEdit) {
        const bData = fetchedBooking || bookingToEdit;
        formik.resetForm({
          values: {
            bookingNumber: bData.bookingNumber || "",
            customerId: typeof bData.customerId === "object" ? bData.customerId?._id : (bData.customerId || ""),
            propertyId: typeof bData.propertyId === "object" ? bData.propertyId?._id : (bData.propertyId || ""),
            projectId: typeof bData.projectId === "object" ? bData.projectId?._id : (bData.projectId || ""),
            unitId: typeof bData.unitId === "object" ? bData.unitId?._id : (bData.unitId || ""),
            agentId: typeof bData.agentId === "object" ? bData.agentId?._id : (bData.agentId || ""),
            bookingDate: bData.bookingDate ? new Date(bData.bookingDate).toISOString().split('T')[0] : "",
            bookingAmount: bData.bookingAmount || 0,
            totalAmount: bData.totalAmount || 0,
            discount: bData.discount || 0,
            tax: bData.tax || 0,
            finalAmount: bData.finalAmount || 0,
            paymentStatus: bData.paymentStatus || "Pending",
            bookingStatus: bData.bookingStatus || "Pending",
            notes: bData.notes || "",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, bookingToEdit, fetchedBooking]);

  const inputCls = (field: keyof AddBookingPayload) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  // Auto calculate final amount
  useEffect(() => {
    const total = Number(formik.values.totalAmount || 0);
    const discount = Number(formik.values.discount || 0);
    const tax = Number(formik.values.tax || 0);
    const final = total - discount + tax;
    
    if (formik.values.finalAmount !== final) {
      formik.setFieldValue("finalAmount", final);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.totalAmount, formik.values.discount, formik.values.tax]);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {bookingToEdit ? "Edit Booking" : "Create Booking"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {bookingToEdit
                  ? "Update the details of the booking."
                  : "Create a new property booking."}
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

          <SectionTitle>Customer Details</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <FormLabel htmlFor="customerId" required>Customer / Buyer</FormLabel>
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
              <FieldError error={formik.errors.customerId} touched={formik.touched.customerId} submitCount={formik.submitCount} />
            </div>
            
            <div className="col-span-2 md:col-span-1">
               <FormLabel htmlFor="agentId">Assigned Agent</FormLabel>
                <Select
                  value={formik.values.agentId}
                  onValueChange={(val) => formik.setFieldValue("agentId", val)}
                >
                  <SelectTrigger className={cn("w-full h-9", inputCls("agentId"))}>
                    <SelectValue placeholder="Select Agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent: any) => (
                      <SelectItem key={agent._id} value={agent._id}>
                        {agent.firstName} {agent.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
          </div>

          <SectionTitle>Property Details</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="projectId">Project</FormLabel>
              <Select
                value={formik.values.projectId}
                onValueChange={(val) => formik.setFieldValue("projectId", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("projectId"))}>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((proj) => (
                    <SelectItem key={proj._id} value={proj._id}>
                      {proj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <FormLabel htmlFor="propertyId">Property</FormLabel>
              <Select
                value={formik.values.propertyId}
                onValueChange={(val) => formik.setFieldValue("propertyId", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("propertyId"))}>
                  <SelectValue placeholder="Select Property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((prop) => (
                    <SelectItem key={prop._id} value={prop._id}>
                      {prop.propertyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 md:col-span-1">
              <FormLabel htmlFor="unitId">Unit</FormLabel>
              <Select
                value={formik.values.unitId}
                onValueChange={(val) => formik.setFieldValue("unitId", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("unitId"))}>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit._id} value={unit._id}>
                      {unit.unitNumber} - {typeof unit.projectId === 'object' && unit.projectId ? unit.projectId.name : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SectionTitle>Financial & Status</SectionTitle>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="bookingNumber">Booking Number</FormLabel>
              <Input
                id="bookingNumber"
                name="bookingNumber"
                placeholder="e.g. BK-001"
                value={formik.values.bookingNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("bookingNumber")}
              />
              <FieldError error={formik.errors.bookingNumber} touched={formik.touched.bookingNumber} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="bookingDate" required>Booking Date</FormLabel>
              <Input
                id="bookingDate"
                name="bookingDate"
                type="date"
                value={formik.values.bookingDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("bookingDate")}
              />
              <FieldError error={formik.errors.bookingDate} touched={formik.touched.bookingDate} submitCount={formik.submitCount} />
            </div>
            
            <div className="col-span-1"></div>

            <div>
              <FormLabel htmlFor="bookingAmount">Booking Amount (₹)</FormLabel>
              <Input
                id="bookingAmount"
                name="bookingAmount"
                type="number"
                value={formik.values.bookingAmount || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("bookingAmount")}
              />
              <FieldError error={formik.errors.bookingAmount} touched={formik.touched.bookingAmount} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="totalAmount">Total Amount (₹)</FormLabel>
              <Input
                id="totalAmount"
                name="totalAmount"
                type="number"
                value={formik.values.totalAmount || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("totalAmount")}
              />
              <FieldError error={formik.errors.totalAmount} touched={formik.touched.totalAmount} submitCount={formik.submitCount} />
            </div>
            
            <div>
              <FormLabel htmlFor="discount">Discount (₹)</FormLabel>
              <Input
                id="discount"
                name="discount"
                type="number"
                value={formik.values.discount || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("discount")}
              />
              <FieldError error={formik.errors.discount} touched={formik.touched.discount} submitCount={formik.submitCount} />
            </div>
            
            <div>
              <FormLabel htmlFor="tax">Tax (₹)</FormLabel>
              <Input
                id="tax"
                name="tax"
                type="number"
                value={formik.values.tax || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("tax")}
              />
              <FieldError error={formik.errors.tax} touched={formik.touched.tax} submitCount={formik.submitCount} />
            </div>
            
            <div>
              <FormLabel htmlFor="finalAmount">Final Amount (₹)</FormLabel>
              <Input
                id="finalAmount"
                name="finalAmount"
                type="number"
                disabled
                value={formik.values.finalAmount || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(inputCls("finalAmount"), "bg-muted font-bold")}
              />
              <FieldError error={formik.errors.finalAmount} touched={formik.touched.finalAmount} submitCount={formik.submitCount} />
            </div>

            <div className="col-span-1"></div>

            <div>
              <FormLabel htmlFor="bookingStatus" required>Booking Status</FormLabel>
              <Select
                value={formik.values.bookingStatus}
                onValueChange={(val) => formik.setFieldValue("bookingStatus", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("bookingStatus"))}>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.bookingStatus} touched={formik.touched.bookingStatus} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="paymentStatus" required>Payment Status</FormLabel>
              <Select
                value={formik.values.paymentStatus}
                onValueChange={(val) => formik.setFieldValue("paymentStatus", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("paymentStatus"))}>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.paymentStatus} touched={formik.touched.paymentStatus} submitCount={formik.submitCount} />
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
                placeholder="Details of the booking..."
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
                : bookingToEdit
                ? "Update Booking"
                : "Create Booking"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
