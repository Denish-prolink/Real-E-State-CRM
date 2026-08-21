import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, MoreVertical, MapPin, IndianRupee, Ruler, Bed, Bath, Car, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetPropertyById, useUpdateProperty, useDeleteProperty } from "../hooks/useProperties";
import PropertyFormDrawer from "../components/PropertyFormDrawer";
import type { AddPropertyPayload } from "../types/property.types";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";

import EntityDocuments from "../../documents/components/EntityDocuments";

export default function ViewPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: property, isLoading, error, refetch } = useGetPropertyById(id || "");
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 min-h-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-muted-foreground text-sm">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col gap-4 p-6 min-h-full items-center justify-center">
        <p className="text-red-500 font-medium">Failed to load property or property not found.</p>
        <Button onClick={() => navigate("/properties")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Properties
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200';
      case 'Reserved': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200';
      case 'Blocked': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200';
      case 'Booked': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200';
      case 'Sold': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case 'Sale': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Rent': return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'Lease': return 'bg-teal-100 text-teal-700 border-teal-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleEditSubmit = async (values: AddPropertyPayload | FormData) => {
    try {
      await updatePropertyMutation.mutateAsync({ id: property._id, payload: values as any });
      toast.success("Property updated successfully");
      setDrawerOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update property");
    }
  };

  const handleDelete = async () => {
    try {
      await deletePropertyMutation.mutateAsync(property._id);
      toast.success("Property deleted successfully");
      setShowDeleteConfirm(false);
      navigate("/properties");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete property");
    }
  };

  const projectName = typeof property.projectId === 'object' && property.projectId
    ? property.projectId.name
    : '';

  const photos = property.photos && property.photos.length > 0 
    ? property.photos 
    : property.media?.map(m => m.url) || [];

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full max-w-5xl mx-auto">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate("/properties")}
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Properties
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
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border ${getPurposeColor(property.purpose)}`}>
              {property.purpose}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border ${getStatusColor(property.status)}`}>
              {property.status}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
              {property.propertyType}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {property.title}
          </h1>
          {projectName && (
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-1">
              Project: {projectName}
            </p>
          )}
          {property.location?.address && (
            <div className="flex items-center gap-1.5 text-muted-foreground mt-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{property.location.address}, {property.location.city} {property.location.state}</span>
            </div>
          )}
        </div>
        
        <div className="shrink-0 flex flex-col items-start md:items-end bg-muted/30 p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground font-medium mb-1">Asking Price</p>
          <div className="flex items-center text-3xl font-black text-indigo-600 dark:text-indigo-400">
            <IndianRupee className="h-7 w-7 mr-1" />
            {property.price.toLocaleString('en-IN')}
          </div>
          <div className="text-sm font-semibold text-muted-foreground mt-1">
            {property.area} sq.ft
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      {photos.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Photos
          </h3>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
            {photos.map((photoUrl, idx) => {
              const fullImageUrl = photoUrl.startsWith('/') ? `${import.meta.env.VITE_API_URL}${photoUrl}` : photoUrl;
              return (
              <img 
                key={idx} 
                src={fullImageUrl} 
                alt={`Property Photo ${idx + 1}`} 
                className="h-64 w-96 object-cover rounded-lg border border-border shadow-sm shrink-0 snap-center"
              />
              );
            })}
          </div>
        </div>
      )}

      {/* Details Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specs & Features */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Property Specifications
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Bed className="h-4 w-4 text-indigo-500" /> Bedrooms
              </div>
              <p className="font-semibold text-foreground">{property.bedrooms ?? 'N/A'}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Bath className="h-4 w-4 text-indigo-500" /> Bathrooms
              </div>
              <p className="font-semibold text-foreground">{property.bathrooms ?? 'N/A'}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Car className="h-4 w-4 text-indigo-500" /> Parking
              </div>
              <p className="font-semibold text-foreground">{property.parking ?? 'N/A'}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Ruler className="h-4 w-4 text-indigo-500" /> Area
              </div>
              <p className="font-semibold text-foreground">{property.area} sq.ft</p>
            </div>
          </div>
        </div>

        {/* Location & Placement */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Location & Unit Info
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {property.tower && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tower / Block</p>
                <p className="font-semibold text-foreground">{property.tower}</p>
              </div>
            )}
            {property.floor && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Floor</p>
                <p className="font-semibold text-foreground">{property.floor}</p>
              </div>
            )}
            {property.unitNumber && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Unit Number</p>
                <p className="font-semibold text-foreground">{property.unitNumber}</p>
              </div>
            )}
            <div className="col-span-full">
               <p className="text-xs text-muted-foreground mb-1">Full Address</p>
               <p className="font-semibold text-foreground text-sm">
                 {[
                   property.location?.address,
                   property.location?.city,
                   property.location?.state,
                   property.location?.country
                 ].filter(Boolean).join(', ') || 'N/A'}
               </p>
            </div>
          </div>
        </div>

        {/* Description Card */}
        {property.description && (
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 md:col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-500" /> Description
            </h3>
            <div className="text-sm rounded-lg p-4 bg-muted/20 border border-border">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>
          </div>
        )}
      </div>

      <EntityDocuments relatedType="Property" relatedId={id as string} />

      {/* Edit Form Drawer */}
      <PropertyFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleEditSubmit}
        propertyToEdit={property}
        isSubmitting={updatePropertyMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={(val) => !val && !deletePropertyMutation.isPending && setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isPending={deletePropertyMutation.isPending}
        title="Delete Property"
        description="Are you sure you want to permanently delete this property? This action cannot be undone."
      />
    </div>
  );
}
