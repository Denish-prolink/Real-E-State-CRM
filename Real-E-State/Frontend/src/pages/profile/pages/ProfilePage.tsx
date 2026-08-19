import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { updateUserAgency } from '@/pages/auth/slices/auth.slice';
import { Building, Mail, Phone, MapPin, FileText, Edit, Users, Shield } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CompanyFormDrawer from '@/pages/companies/components/CompanyFormDrawer';
import { useUpdateCompany } from '@/pages/companies/hooks/useUpdateCompany';

import type { AddCompanyPayload } from '@/pages/companies/types/company.types';

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { mutateAsync: updateCompany } = useUpdateCompany();

  const handleUpdateCompany = async (values: AddCompanyPayload) => {
    if (user?.agencyId?._id) {
      const response = await updateCompany({ id: user.agencyId._id, payload: values });
      if (response && response.data) {
        dispatch(updateUserAgency(response.data));
      }
      setIsDrawerOpen(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
        {/* User Details Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">User Information</h3>
            <p className="text-sm text-muted-foreground">Your account details</p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{user?.firstName} {user?.lastName}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3" /> {user?.email}
                  </p>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mt-2 capitalize bg-primary/10 text-primary">
                    {user?.role?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Details Card */}
        {user?.agencyId && (
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6 relative">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold leading-none tracking-tight">Company Details</h3>
                  <p className="text-sm text-muted-foreground mt-1.5">Information about your company</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsDrawerOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-16 w-16 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                  {user.agencyId.logo ? (
                    <img 
                      src={getImageUrl(user.agencyId.logo)} 
                      alt={user.agencyId.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold">{user.agencyId.name}</h4>
                  <div className="flex gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                    {user.agencyId.gst && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> GST: {user.agencyId.gst}
                      </span>
                    )}
                    {user.agencyId.pan && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> PAN: {user.agencyId.pan}
                      </span>
                    )}
                    {user.agencyId.sences && (
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" /> License: {user.agencyId.sences}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  {user.agencyId.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.agencyId.email}</span>
                    </div>
                  )}
                  {user.agencyId.contactNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user.agencyId.contactNumber}</span>
                    </div>
                  )}
                </div>
                
                {user.agencyId.members !== undefined && (
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{user.agencyId.members} Members</span>
                  </div>
                )}

                {(user.agencyId.addressLine1 || user.agencyId.city || user.agencyId.state) && (
                  <div className="flex items-start gap-2 mt-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {user.agencyId.addressLine1}
                      {user.agencyId.addressLine2 && `, ${user.agencyId.addressLine2}`}
                      <br />
                      {user.agencyId.city && `${user.agencyId.city}, `}
                      {user.agencyId.state && `${user.agencyId.state} `}
                      {user.agencyId.pincode && `- ${user.agencyId.pincode}`}
                      <br />
                      {user.agencyId.country}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {user?.agencyId && (
        <CompanyFormDrawer 
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSubmit={handleUpdateCompany}
          editCompanyId={user.agencyId._id}
        />
      )}
    </div>
  );
}
