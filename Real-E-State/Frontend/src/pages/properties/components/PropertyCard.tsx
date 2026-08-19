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
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Reserved':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Sold':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Rented':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      {/* Property Photo placeholder */}
      <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground/30 relative">
        {property.images && property.images.length > 0 ? (
          <img src={property.images[0]} alt={property.propertyName} className="w-full h-full object-cover" />
        ) : (
          <Home className="h-12 w-12" />
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getStatusColor(property.status)}`}>
            {property.status}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border bg-indigo-50 text-indigo-700 border-indigo-200`}>
            {property.propertyType}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <TruncatedName name={property.propertyName} maxLength={28} className="font-bold text-foreground text-lg block" />
            <span className="text-xs text-muted-foreground font-medium mt-0.5 block truncate">
               {property.propertyId ? `#${property.propertyId} • ` : ''}{property.category || 'Standard'}
            </span>
          </div>

          <div className="flex items-center shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1.5 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer">
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
          <div className="flex items-center gap-1 text-lg font-extrabold text-indigo-600">
            <IndianRupee className="h-4 w-4" />
            <span>{property.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-xs text-muted-foreground font-semibold">
            {property.area} {property.areaUnit || 'sq.ft'}
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
          {property.address && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground/75 shrink-0" />
              <span className="truncate">{property.address}{property.city ? `, ${property.city}` : ''}</span>
            </div>
          )}
          {(property.furnishedStatus || property.constructionStatus) && (
            <div className="bg-muted/40 p-2 rounded-md flex justify-between gap-2 mt-1">
              {property.furnishedStatus && <span><strong className="text-foreground">{property.furnishedStatus}</strong></span>}
              {property.constructionStatus && <span><strong className="text-foreground">{property.constructionStatus}</strong></span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
