export interface SiteVisit {
  _id: string;
  agencyId: string;
  leadId?: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string | null;
  buyerId?: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string | null;
  propertyId?: {
    _id: string;
    propertyName: string;
  } | string | null;
  projectId?: {
    _id: string;
    name: string;
  } | string | null;
  unitId?: {
    _id: string;
    unitNumber: string;
  } | string | null;
  agentId?: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string | null;
  visitDate: string;
  visitTime?: string;
  location?: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'No Show';
  notes?: string;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export type AddSiteVisitPayload = Omit<SiteVisit, '_id' | 'agencyId' | 'createdAt' | 'updatedAt'>;
export type UpdateSiteVisitPayload = Partial<AddSiteVisitPayload>;
