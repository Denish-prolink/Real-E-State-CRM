import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Mail, Phone, Trash2, Calendar, MapPin, FileText, MoreVertical, IndianRupee, Home, Ruler, Bed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetLeadById } from "../hooks/useGetLeadById";
import { useUpdateLead } from "../hooks/useUpdateLead";
import { useDeleteLead } from "../hooks/useDeleteLead";
import LeadFormDrawer from "../components/LeadFormDrawer";
import type { AddLeadPayload } from "../types/lead.types";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";

import EntityDocuments from "../../documents/components/EntityDocuments";

export default function LeadDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: lead, isLoading, error, refetch } = useGetLeadById(id || "", {
    enabled: !!id,
  });

  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 min-h-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-muted-foreground text-sm">Loading lead details...</p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col gap-4 p-6 min-h-full items-center justify-center">
        <p className="text-red-500 font-medium">Failed to load lead or lead not found.</p>
        <Button onClick={() => navigate("/leads")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Leads
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Contacted':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'Qualified':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Site Visit':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'Negotiation':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
      case 'Converted':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Lost':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  const handleEditSubmit = async (values: AddLeadPayload) => {
    try {
      await updateLeadMutation.mutateAsync({ id: lead._id, payload: values });
      toast.success("Lead updated successfully");
      setDrawerOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update lead");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLeadMutation.mutateAsync(lead._id);
      toast.success("Lead deleted successfully");
      setShowDeleteConfirm(false);
      navigate("/leads");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete lead");
    }
  };

  const getInitials = (first: string, last?: string) => {
    return (first[0] + (last ? last[0] : '')).toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full max-w-4xl mx-auto">
      {/* Back button and Action Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate("/leads")}
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Leads
        </Button>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted cursor-pointer">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-lg">
              <DropdownMenuItem onClick={() => setDrawerOpen(true)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteConfirm(true)} className="cursor-pointer text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className={`h-16 w-16 rounded-full flex items-center justify-center border-2 shadow-md font-bold text-2xl shrink-0 ${getStatusColor(lead.status)}`}>
          {getInitials(lead.firstName, lead.lastName)}
        </div>
        <div className="text-center sm:text-left flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">
                {lead.firstName} {lead.lastName || ""}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">Created on {new Date(lead.createdAt).toLocaleDateString('en-IN')}</p>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-end gap-2 shrink-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getPriorityColor(lead.priority)}`}>
                Priority: {lead.priority}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lead Contact Info */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Contact Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Phone Number</p>
                <p className="font-semibold text-foreground mt-0.5 text-sm">{lead.phone}</p>
              </div>
            </div>
            {lead.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="font-semibold text-foreground mt-0.5 text-sm">{lead.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lead Configuration & Info */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            CRM Metadata
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Lead Source</p>
              <p className="font-semibold text-foreground mt-0.5 text-sm">{lead.source}</p>
            </div>
            {lead.expectedPurchaseDate && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Expected Purchase Date</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <p className="font-semibold text-foreground text-sm">
                    {new Date(lead.expectedPurchaseDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Requirements Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Requirements & Preferences
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IndianRupee className="h-3.5 w-3.5 text-indigo-500" /> Budget
              </div>
              <p className="font-bold text-lg text-indigo-600 mt-1">
                {lead.budget ? `₹${lead.budget.toLocaleString('en-IN')}` : "Any"}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Home className="h-3.5 w-3.5 text-indigo-500" /> Type
              </div>
              <p className="font-semibold text-foreground mt-1 text-sm">
                {lead.propertyType || "Any"}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Bed className="h-3.5 w-3.5 text-indigo-500" /> Bedrooms
              </div>
              <p className="font-semibold text-foreground mt-1 text-sm">
                {lead.bedrooms ? `${lead.bedrooms} BHK` : "Any"}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Ruler className="h-3.5 w-3.5 text-indigo-500" /> Min Area
              </div>
              <p className="font-semibold text-foreground mt-1 text-sm">
                {lead.area ? `${lead.area} sq.ft` : "Any"}
              </p>
            </div>

            {lead.location && (
              <div className="col-span-full pt-2 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500" /> Preferred Location
                </div>
                <p className="font-semibold text-foreground mt-1 text-sm">
                  {lead.location}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notes Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-500" /> Notes & History
          </h3>
          <div className="text-sm bg-muted/20 rounded-lg p-4 border border-border min-h-24">
            <p className="text-foreground italic leading-relaxed whitespace-pre-wrap">
              {lead.notes || "No extra notes recorded for this lead."}
            </p>
          </div>
        </div>
      </div>

      <EntityDocuments relatedType="Lead" relatedId={id as string} />

      {/* Edit Form Drawer */}
      <LeadFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleEditSubmit}
        leadToEdit={lead}
        isSubmitting={updateLeadMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={(val) => !val && !deleteLeadMutation.isPending && setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isPending={deleteLeadMutation.isPending}
        title="Delete Lead"
        itemName={`${lead.firstName} ${lead.lastName || ""}`}
      />
    </div>
  );
}
