import type { AddSiteVisitPayload, SiteVisit } from "../types/siteVisit.types";
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
import { siteVisitSchema } from "../schemas/siteVisit.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetSiteVisitById } from "../hooks/useSiteVisits";
import { useGetLeads } from "../../leads/hooks/useGetLeads";
import { useGetBuyers } from "../../buyers/hooks/useGetBuyers";
import { useGetProjects } from "../../projects/hooks/useProjects";
import { useGetProperties } from "../../properties/hooks/useProperties";
import { useGetEmployees } from "../../employees/hooks/useGetEmployees";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddSiteVisitPayload) => void | Promise<void>;
  visitToEdit?: SiteVisit | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddSiteVisitPayload = {
  leadId: "",
  buyerId: "",
  propertyId: "",
  projectId: "",
  unitId: "",
  agentId: "",
  visitDate: new Date().toISOString().split('T')[0],
  visitTime: "",
  location: "",
  status: "Scheduled",
  notes: "",
  feedback: "",
};

export default function SiteVisitFormDrawer({
  open,
  onClose,
  onSubmit,
  visitToEdit,
  isSubmitting = false,
}: Props) {
  const { data: fetchedVisit, isLoading: isFetching } = useGetSiteVisitById(
    visitToEdit?._id || ""
  );

  const { data: leadsApi = {} as any } = useGetLeads(); const leads = leadsApi?.data?.leads || leadsApi?.leads || (Array.isArray(leadsApi) ? leadsApi : []);
  const { data: buyersApi = {} as any } = useGetBuyers(); const buyers = buyersApi?.data?.buyers || buyersApi?.buyers || (Array.isArray(buyersApi) ? buyersApi : []);
  const { data: projects = [] } = useGetProjects();
  const { data: properties = [] } = useGetProperties();
  const { data: agentsApi = {} as any } = useGetEmployees(); const agents = agentsApi?.data?.employees || agentsApi?.employees || (Array.isArray(agentsApi) ? agentsApi : []);

  const formik = useFormik<AddSiteVisitPayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: siteVisitSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        const payload = { ...values };
        if (!payload.leadId) delete payload.leadId;
        if (!payload.buyerId) delete payload.buyerId;
        if (!payload.propertyId) delete payload.propertyId;
        if (!payload.projectId) delete payload.projectId;
        if (!payload.unitId) delete payload.unitId;
        if (!payload.agentId) delete payload.agentId;
        if (!payload.visitTime) delete payload.visitTime;
        if (!payload.location) delete payload.location;
        if (!payload.notes) delete payload.notes;
        if (!payload.feedback) delete payload.feedback;

        await onSubmit(payload);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (visitToEdit) {
        const vData = fetchedVisit || visitToEdit;
        formik.resetForm({
          values: {
            leadId: typeof vData.leadId === "object" ? vData.leadId?._id : (vData.leadId || ""),
            buyerId: typeof vData.buyerId === "object" ? vData.buyerId?._id : (vData.buyerId || ""),
            propertyId: typeof vData.propertyId === "object" ? vData.propertyId?._id : (vData.propertyId || ""),
            projectId: typeof vData.projectId === "object" ? vData.projectId?._id : (vData.projectId || ""),
            unitId: typeof vData.unitId === "object" ? vData.unitId?._id : (vData.unitId || ""),
            agentId: typeof vData.agentId === "object" ? vData.agentId?._id : (vData.agentId || ""),
            visitDate: new Date(vData.visitDate).toISOString().split('T')[0],
            visitTime: vData.visitTime || "",
            location: vData.location || "",
            status: vData.status || "Scheduled",
            notes: vData.notes || "",
            feedback: vData.feedback || "",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, visitToEdit, fetchedVisit]);

  const inputCls = (field: keyof AddSiteVisitPayload) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {visitToEdit ? "Edit Site Visit" : "Schedule Site Visit"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {visitToEdit
                  ? "Update the details of the scheduled visit."
                  : "Schedule a new property site visit."}
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
            <div>
              <FormLabel htmlFor="leadId">Lead</FormLabel>
              <Select
                value={formik.values.leadId}
                onValueChange={(val) => {
                  formik.setFieldValue("leadId", val);
                  if (val) formik.setFieldValue("buyerId", ""); // Exclusive
                }}
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

            <div>
              <FormLabel htmlFor="buyerId">Or Buyer</FormLabel>
              <Select
                value={formik.values.buyerId}
                onValueChange={(val) => {
                  formik.setFieldValue("buyerId", val);
                  if (val) formik.setFieldValue("leadId", ""); // Exclusive
                }}
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
              <FieldError error={formik.errors.buyerId} touched={formik.touched.buyerId} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Property & Location</SectionTitle>
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
            
            <div className="col-span-2">
              <FormLabel htmlFor="location">Meeting Location</FormLabel>
              <Input
                id="location"
                name="location"
                placeholder="e.g. Sales Office, Project Site"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("location")}
              />
              <FieldError error={formik.errors.location} touched={formik.touched.location} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Schedule</SectionTitle>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="visitDate" required>Visit Date</FormLabel>
              <Input
                id="visitDate"
                name="visitDate"
                type="date"
                value={formik.values.visitDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("visitDate")}
              />
              <FieldError error={formik.errors.visitDate} touched={formik.touched.visitDate} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="visitTime">Visit Time</FormLabel>
              <Input
                id="visitTime"
                name="visitTime"
                type="time"
                value={formik.values.visitTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("visitTime")}
              />
              <FieldError error={formik.errors.visitTime} touched={formik.touched.visitTime} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="status" required>Status</FormLabel>
              <Select
                value={formik.values.status}
                onValueChange={(val) => formik.setFieldValue("status", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("status"))}>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="No Show">No Show</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.status} touched={formik.touched.status} submitCount={formik.submitCount} />
            </div>
            
            <div className="col-span-3">
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

          <SectionTitle>Additional Information</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FormLabel htmlFor="notes">Notes</FormLabel>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="Any special requirements or instructions..."
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

            <div>
              <FormLabel htmlFor="feedback">Client Feedback (After Visit)</FormLabel>
              <textarea
                id="feedback"
                name="feedback"
                rows={2}
                placeholder="How did the visit go? What did the client say?"
                value={formik.values.feedback}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  inputCls("feedback")
                )}
              />
              <FieldError error={formik.errors.feedback} touched={formik.touched.feedback} submitCount={formik.submitCount} />
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
                : visitToEdit
                ? "Update Visit"
                : "Schedule Visit"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
