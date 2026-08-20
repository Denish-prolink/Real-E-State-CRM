import { Edit2, Eye, Trash2, MoreVertical, MapPin, IndianRupee, Bed, Bath, Car, Home } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TruncatedName } from '@/components/common/TruncatedName';
import type { Property } from '../types/property.types';

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onView?: (property: Property) => void;
}

export default function PropertyCard({ property, onEdit, onDelete, onView }: PropertyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Reserved':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Blocked':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'Booked':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Sold':
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case 'Sale':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400';
      case 'Rent':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400';
      case 'Lease':
        return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const projectName = typeof property.projectId === 'object' && property.projectId
    ? property.projectId.name
    : '';

  return (
    <div className="flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      {/* Property Photo placeholder or first media */}
      <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground/30 relative">
        {property.photos && property.photos.length > 0 ? (
          <img src={property.photos[0].startsWith('/') ? `${import.meta.env.VITE_API_URL}${property.photos[0]}` : property.photos[0]} alt={property.title} className="w-full h-full object-cover" />
        ) : property.media && property.media.length > 0 ? (
          <img src={property.media[0].url} alt={property.title} className="w-full h-full object-cover" />
        ) : (
          <Home className="h-12 w-12" />
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getPurposeColor(property.purpose)}`}>
            {property.purpose}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getStatusColor(property.status)}`}>
            {property.status}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <TruncatedName name={property.title} maxLength={28} className="font-bold text-foreground text-lg block" />
            <span className="text-xs text-muted-foreground font-medium mt-0.5 block">
              {property.propertyType} {projectName ? `• Project: ${projectName}` : ''}
            </span>
          </div>

          <div className="flex items-center shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1.5 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-md transition-colors cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 rounded-lg">
                {onView && (
                  <DropdownMenuItem onClick={() => onView(property)} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    Details
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onEdit(property)} className="cursor-pointer">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(property._id)} className="cursor-pointer text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Pricing & Area */}
        <div className="flex items-center justify-between border-t border-b border-border/50 py-2.5">
          <div className="flex items-center gap-1 text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
            <IndianRupee className="h-4 w-4" />
            <span>{property.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-xs text-muted-foreground font-semibold">
            {property.area} sq.ft
          </div>
        </div>

        {/* Attributes (Beds, Baths, Parking) */}
        {(property.bedrooms !== undefined || property.bathrooms !== undefined || property.parking !== undefined) && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {property.bedrooms !== undefined && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-indigo-500" />
                <span>{property.bedrooms} Bed</span>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-indigo-500" />
                <span>{property.bathrooms} Bath</span>
              </div>
            )}
            {property.parking !== undefined && (
              <div className="flex items-center gap-1.5">
                <Car className="h-4 w-4 text-indigo-500" />
                <span>{property.parking} Park</span>
              </div>
            )}
          </div>
        )}

        {/* Location & Details */}
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mt-auto">
          {property.location?.address && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground/75 shrink-0" />
              <span className="truncate">{property.location.address}, {property.location.city || ''}</span>
            </div>
          )}
          {(property.tower || property.floor || property.unitNumber) && (
            <div className="bg-muted/40 p-2 rounded-md flex justify-between gap-2 mt-1">
              {property.tower && <span>Tower: <strong className="text-foreground">{property.tower}</strong></span>}
              {property.floor && <span>Floor: <strong className="text-foreground">{property.floor}</strong></span>}
              {property.unitNumber && <span>Unit: <strong className="text-foreground">{property.unitNumber}</strong></span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
