import type { Property } from '../types/property.types';
import PropertyCard from './PropertyCard';
import { Home } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  isLoading: boolean;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onView?: (property: Property) => void;
}

export default function PropertyGrid({ properties, isLoading, onEdit, onDelete, onView }: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden h-96 flex flex-col">
            <div className="h-40 bg-muted" />
            <div className="p-5 flex-1 flex flex-col gap-4">
              <div className="h-5 bg-muted rounded w-2/3" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-8 bg-muted rounded w-full mt-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-xl border-dashed">
        <Home className="h-10 w-10 text-muted-foreground/50 animate-bounce" />
        <p className="font-medium text-lg mt-2">No properties found</p>
        <p className="text-muted-foreground mt-1 text-sm">Add properties to start managing real estate inventory.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}
