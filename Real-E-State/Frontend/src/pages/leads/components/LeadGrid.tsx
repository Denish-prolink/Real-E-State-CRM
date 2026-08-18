import type { Lead } from '../types/lead.types';
import LeadCard from './LeadCard';
import { UserCheck } from 'lucide-react';

interface LeadGridProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;
}

export default function LeadGrid({ leads, isLoading, onEdit, onDelete, onView }: LeadGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-48 bg-card rounded-xl border border-border shadow-sm animate-pulse p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4 border-t border-border/50 pt-3">
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-xl border-dashed">
        <UserCheck className="h-10 w-10 text-muted-foreground/50 animate-bounce" />
        <p className="font-medium text-lg mt-2">No leads found</p>
        <p className="text-muted-foreground mt-1 text-sm">Get started by adding a new lead to your CRM.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {leads.map((lead) => (
        <LeadCard
          key={lead._id}
          lead={lead}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}
