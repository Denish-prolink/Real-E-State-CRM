import type { AddFollowUpPayload, FollowUp } from "../types/followUp.types";
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
import { followUpSchema } from "../schemas/followUp.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetFollowUpById } from "../hooks/useFollowUps";
import { useGetLeads } from "../../leads/hooks/useGetLeads";
import { useGetBuyers } from "../../buyers/hooks/useGetBuyers";
import { useGetEmployees } from "../../employees/hooks/useGetEmployees";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddFollowUpPayload) => void | Promise<void>;
  followUpToEdit?: FollowUp | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddFollowUpPayload = {
  leadId: "",
  customerId: "",
  agentId: "",
  followUpType: "Call",
  date: new Date().toISOString().split('T')[0],
  time: "",
  status: "Pending",
  notes: "",
  nextFollowUp: "",
};

export default function FollowUpFormDrawer({
  open,
  onClose,
  onSubmit,
  followUpToEdit,
  isSubmitting = false,
}: Props) {
  const { data: fetchedFu, isLoading: isFetching } = useGetFollowUpById(
    followUpToEdit?._id || ""
  );

  const { data: leadsApi = {} as any } = useGetLeads(); const leads = leadsApi?.data?.leads || leadsApi?.leads || (Array.isArray(leadsApi) ? leadsApi : []);
  const { data: buyersApi = {} as any } = useGetBuyers(); const buyers = buyersApi?.data?.buyers || buyersApi?.buyers || (Array.isArray(buyersApi) ? buyersApi : []);
  const { data: agentsApi = {} as any } = useGetEmployees(); const agents = agentsApi?.data?.employees || agentsApi?.employees || (Array.isArray(agentsApi) ? agentsApi : []);

  const formik = useFormik<AddFollowUpPayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: followUpSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        const payload = { ...values };
        if (!payload.leadId) delete payload.leadId;
        if (!payload.customerId) delete payload.customerId;
        if (!payload.agentId) delete payload.agentId;
        if (!payload.date) delete payload.date;
        if (!payload.time) delete payload.time;
        if (!payload.nextFollowUp) delete payload.nextFollowUp;
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
      if (followUpToEdit) {
        const vData = fetchedFu || followUpToEdit;
        formik.resetForm({
          values: {
            leadId: typeof vData.leadId === "object" ? vData.leadId?._id : (vData.leadId || ""),
            customerId: typeof vData.customerId === "object" ? vData.customerId?._id : (vData.customerId || ""),
            agentId: typeof vData.agentId === "object" ? vData.agentId?._id : (vData.agentId || ""),
            followUpType: vData.followUpType || "Call",
            date: vData.date ? new Date(vData.date).toISOString().split('T')[0] : "",
            time: vData.time || "",
            status: vData.status || "Pending",
            notes: vData.notes || "",
            nextFollowUp: vData.nextFollowUp ? new Date(vData.nextFollowUp).toISOString().split('T')[0] : "",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, followUpToEdit, fetchedFu]);

  const inputCls = (field: keyof AddFollowUpPayload) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {followUpToEdit ? "Edit Follow-Up" : "Add Follow-Up"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {followUpToEdit
                  ? "Update the details of the follow-up."
                  : "Schedule a new follow-up activity."}
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
                  if (val) formik.setFieldValue("customerId", ""); // Exclusive
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
              <FormLabel htmlFor="customerId">Or Customer/Buyer</FormLabel>
              <Select
                value={formik.values.customerId}
                onValueChange={(val) => {
                  formik.setFieldValue("customerId", val);
                  if (val) formik.setFieldValue("leadId", ""); // Exclusive
                }}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("customerId"))}>
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
              <FieldError error={formik.errors.customerId} touched={formik.touched.customerId} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Activity Details</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="followUpType">Type</FormLabel>
              <Select
                value={formik.values.followUpType}
                onValueChange={(val) => formik.setFieldValue("followUpType", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("followUpType"))}>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Call">Call</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Site Visit">Site Visit</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                  <SelectItem value="Missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <SectionTitle>Schedule</SectionTitle>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="date">Date</FormLabel>
              <Input
                id="date"
                name="date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("date")}
              />
              <FieldError error={formik.errors.date} touched={formik.touched.date} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="time">Time</FormLabel>
              <Input
                id="time"
                name="time"
                type="time"
                value={formik.values.time}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("time")}
              />
              <FieldError error={formik.errors.time} touched={formik.touched.time} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="nextFollowUp">Next Follow-Up</FormLabel>
              <Input
                id="nextFollowUp"
                name="nextFollowUp"
                type="date"
                value={formik.values.nextFollowUp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("nextFollowUp")}
              />
              <FieldError error={formik.errors.nextFollowUp} touched={formik.touched.nextFollowUp} submitCount={formik.submitCount} />
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

          <SectionTitle>Notes</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FormLabel htmlFor="notes">Notes</FormLabel>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Details of the conversation, next steps..."
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
                : followUpToEdit
                ? "Update Follow-Up"
                : "Add Follow-Up"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
