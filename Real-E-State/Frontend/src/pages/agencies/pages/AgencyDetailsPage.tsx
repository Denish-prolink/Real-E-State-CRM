import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Mail, Phone, Trash2, MapPin, MoreVertical, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetAgency } from "../hooks/useGetAgency";
import { useUpdateAgency } from "../hooks/useUpdateAgency";
import { useDeleteAgency } from "../hooks/useDeleteAgency";
import AgencyFormDrawer from "../components/AgencyFormDrawer";
import type { AddAgencyPayload } from "../types/agency.types";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";

export default function AgencyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: agency, isLoading, error, refetch } = useGetAgency(id || null);

  const updateAgencyMutation = useUpdateAgency();
  const deleteAgencyMutation = useDeleteAgency();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 min-h-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-muted-foreground text-sm">Loading agency details...</p>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="flex flex-col gap-4 p-6 min-h-full items-center justify-center">
        <p className="text-red-500 font-medium">Failed to load agency or agency not found.</p>
        <Button onClick={() => navigate("/agencies")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Agencies
        </Button>
      </div>
    );
  }

  const handleEditSubmit = async (values: AddAgencyPayload) => {
    try {
      await updateAgencyMutation.mutateAsync({ id: agency._id, payload: values });
      setDrawerOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update agency");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAgencyMutation.mutateAsync(agency._id);
      toast.success("Agency deleted successfully");
      setShowDeleteConfirm(false);
      navigate("/agencies");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete agency");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full max-w-4xl mx-auto">
      {/* Back button and Action Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate("/agencies")}
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Agencies
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
      <div className="bg-card border border-border rounded-xl shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4">
        {agency.logo ? (
          <img
            src={getImageUrl(agency.logo)}
            alt={agency.name || "Agency"}
            className="h-12 w-12 rounded-xl object-cover border border-border shadow-sm shrink-0"
          />
        ) : (
          <div className="h-12 w-12 text-xl rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0 border border-indigo-100 dark:border-indigo-800">
            {agency.name.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div className="text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
            <h1 className="text-xl font-bold tracking-tight text-foreground truncate">{agency.name}</h1>
            <Badge variant={agency.status === "active" ? "default" : "secondary"} className={agency.status === "active" ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" : ""}>
              {agency.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Details Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact info card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Contact Number</p>
                <p className="font-semibold text-foreground mt-0.5 text-sm">{agency.contactNumber || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="font-semibold text-foreground mt-0.5 text-sm">{agency.email || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Registrations details card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Business Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">GST Number</p>
              <p className="font-semibold text-foreground mt-0.5 text-sm">{agency.gst || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">PAN Number</p>
              <p className="font-semibold text-foreground mt-0.5 text-sm">{agency.pan || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Licenses/Sences</p>
              <p className="font-semibold text-foreground mt-0.5 text-sm">{agency.sences || "-"}</p>
            </div>
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Members</p>
                <p className="font-semibold text-foreground mt-0.5 text-sm">{agency.members ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-500" /> Address Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Address Line 1</p>
              <p className="font-medium text-foreground mt-0.5">{agency.addressLine1 || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Address Line 2</p>
              <p className="font-medium text-foreground mt-0.5">{agency.addressLine2 || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">City & State</p>
              <p className="font-medium text-foreground mt-0.5">
                {agency.city ? `${agency.city}, ` : ""}{agency.state || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Country & Pincode</p>
              <p className="font-medium text-foreground mt-0.5">
                {agency.country || "-"} - {agency.pincode || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Drawer */}
      <AgencyFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleEditSubmit}
        editAgencyId={agency._id}
      />

      {/* Delete Confirmation Alert Dialog */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={(val) => !val && !deleteAgencyMutation.isPending && setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isPending={deleteAgencyMutation.isPending}
        title="Delete Agency"
        itemName={agency.name}
      />
    </div>
  );
}
