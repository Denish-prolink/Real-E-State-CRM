import type { AddDealPayload, Deal } from "../types/deal.types";
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
import { dealSchema } from "../schemas/deal.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetDealById } from "../hooks/useDeals";
import { useGetLeads } from "../../leads/hooks/useGetLeads";
import { useGetBuyers } from "../../buyers/hooks/useGetBuyers";
import { useGetSellers } from "../../sellers/hooks/useGetSellers";
import { useGetProjects } from "../../projects/hooks/useProjects";
import { useGetProperties } from "../../properties/hooks/useProperties";
import { useGetUnits } from "../../units/hooks/useUnits";
import { useGetEmployees } from "../../employees/hooks/useGetEmployees";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddDealPayload) => void | Promise<void>;
  dealToEdit?: Deal | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddDealPayload = {
  dealId: "",
  leadId: "",
  buyerId: "",
  sellerId: "",
  propertyId: "",
  projectId: "",
  unitId: "",
  agentId: "",
  dealAmount: 0,
  commission: 0,
  discount: 0,
  expectedClosingDate: "",
  closingDate: "",
  status: "Lead",
  notes: "",
};

export default function DealFormDrawer({
  open,
  onClose,
  onSubmit,
  dealToEdit,
  isSubmitting = false,
}: Props) {
  const { data: fetchedDeal, isLoading: isFetching } = useGetDealById(
    dealToEdit?._id || ""
  );

  const { data: leadsApi = {} as any } = useGetLeads(); const leads = leadsApi?.data?.leads || leadsApi?.leads || (Array.isArray(leadsApi) ? leadsApi : []);
  const { data: buyersApi = {} as any } = useGetBuyers(); const buyers = buyersApi?.data?.buyers || buyersApi?.buyers || (Array.isArray(buyersApi) ? buyersApi : []);
  const { data: sellersApi = {} as any } = useGetSellers(); const sellers = sellersApi?.data?.sellers || sellersApi?.sellers || (Array.isArray(sellersApi) ? sellersApi : []);
  const { data: projects = [] } = useGetProjects();
  const { data: properties = [] } = useGetProperties();
  const { data: units = [] } = useGetUnits();
  const { data: agentsApi = {} as any } = useGetEmployees(); const agents = agentsApi?.data?.employees || agentsApi?.employees || (Array.isArray(agentsApi) ? agentsApi : []);

  const formik = useFormik<AddDealPayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: dealSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        const payload = { ...values };
        if (!payload.dealId) delete payload.dealId;
        if (!payload.buyerId) delete payload.buyerId;
        if (!payload.sellerId) delete payload.sellerId;
        if (!payload.propertyId) delete payload.propertyId;
        if (!payload.projectId) delete payload.projectId;
        if (!payload.unitId) delete payload.unitId;
        if (!payload.agentId) delete payload.agentId;
        if (!payload.expectedClosingDate) delete payload.expectedClosingDate;
        if (!payload.closingDate) delete payload.closingDate;
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
      if (dealToEdit) {
        const dData = fetchedDeal || dealToEdit;
        formik.resetForm({
          values: {
            dealId: dData.dealId || "",
            leadId: typeof dData.leadId === "object" ? dData.leadId?._id : (dData.leadId || ""),
            buyerId: typeof dData.buyerId === "object" ? dData.buyerId?._id : (dData.buyerId || ""),
            sellerId: typeof dData.sellerId === "object" ? dData.sellerId?._id : (dData.sellerId || ""),
            propertyId: typeof dData.propertyId === "object" ? dData.propertyId?._id : (dData.propertyId || ""),
            projectId: typeof dData.projectId === "object" ? dData.projectId?._id : (dData.projectId || ""),
            unitId: typeof dData.unitId === "object" ? dData.unitId?._id : (dData.unitId || ""),
            agentId: typeof dData.agentId === "object" ? dData.agentId?._id : (dData.agentId || ""),
            dealAmount: dData.dealAmount || 0,
            commission: dData.commission || 0,
            discount: dData.discount || 0,
            expectedClosingDate: dData.expectedClosingDate ? new Date(dData.expectedClosingDate).toISOString().split('T')[0] : "",
            closingDate: dData.closingDate ? new Date(dData.closingDate).toISOString().split('T')[0] : "",
            status: dData.status || "Lead",
            notes: dData.notes || "",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dealToEdit, fetchedDeal]);

  const inputCls = (field: keyof AddDealPayload) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {dealToEdit ? "Edit Deal" : "Create Deal"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {dealToEdit
                  ? "Update the details of the sales deal."
                  : "Create a new sales deal."}
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

          <SectionTitle>Client Details</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <FormLabel htmlFor="leadId" required>Lead</FormLabel>
              <Select
                value={formik.values.leadId}
                onValueChange={(val) => formik.setFieldValue("leadId", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("leadId"))}>
                  <SelectValue placeholder="Select Lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead: any) => (
                    <SelectItem key={lead._id} value={lead._id}>
                      {lead.firstName} {lead.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.leadId} touched={formik.touched.leadId} submitCount={formik.submitCount} />
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

            <div>
              <FormLabel htmlFor="buyerId">Converted Buyer</FormLabel>
              <Select
                value={formik.values.buyerId}
                onValueChange={(val) => formik.setFieldValue("buyerId", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("buyerId"))}>
                  <SelectValue placeholder="Select Buyer" />
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

            <div>
              <FormLabel htmlFor="sellerId">Associated Seller</FormLabel>
              <Select
                value={formik.values.sellerId}
                onValueChange={(val) => formik.setFieldValue("sellerId", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("sellerId"))}>
                  <SelectValue placeholder="Select Seller" />
                </SelectTrigger>
                <SelectContent>
                  {sellers.map((seller: any) => (
                    <SelectItem key={seller._id} value={seller._id}>
                      {seller.firstName} {seller.lastName}
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
            
            <div className="col-span-2 md:col-span-1">
              <FormLabel htmlFor="dealId">Custom Deal ID</FormLabel>
              <Input
                id="dealId"
                name="dealId"
                placeholder="e.g. DL-2023-001"
                value={formik.values.dealId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("dealId")}
              />
              <FieldError error={formik.errors.dealId} touched={formik.touched.dealId} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Financial & Status</SectionTitle>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="dealAmount" required>Deal Amount (₹)</FormLabel>
              <Input
                id="dealAmount"
                name="dealAmount"
                type="number"
                value={formik.values.dealAmount || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("dealAmount")}
              />
              <FieldError error={formik.errors.dealAmount} touched={formik.touched.dealAmount} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="commission">Commission (₹)</FormLabel>
              <Input
                id="commission"
                name="commission"
                type="number"
                value={formik.values.commission || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("commission")}
              />
              <FieldError error={formik.errors.commission} touched={formik.touched.commission} submitCount={formik.submitCount} />
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
              <FormLabel htmlFor="expectedClosingDate">Expected Closing</FormLabel>
              <Input
                id="expectedClosingDate"
                name="expectedClosingDate"
                type="date"
                value={formik.values.expectedClosingDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("expectedClosingDate")}
              />
              <FieldError error={formik.errors.expectedClosingDate} touched={formik.touched.expectedClosingDate} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="closingDate">Actual Closing</FormLabel>
              <Input
                id="closingDate"
                name="closingDate"
                type="date"
                value={formik.values.closingDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("closingDate")}
              />
              <FieldError error={formik.errors.closingDate} touched={formik.touched.closingDate} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="status" required>Stage/Status</FormLabel>
              <Select
                value={formik.values.status}
                onValueChange={(val) => formik.setFieldValue("status", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("status"))}>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Site Visit">Site Visit</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Booking">Booking</SelectItem>
                  <SelectItem value="Agreement">Agreement</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.status} touched={formik.touched.status} submitCount={formik.submitCount} />
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
                placeholder="Details of the deal, terms..."
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
                : dealToEdit
                ? "Update Deal"
                : "Create Deal"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
