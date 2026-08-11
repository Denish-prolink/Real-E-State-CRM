import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { updateUserCompany } from '@/pages/auth/slices/auth.slice';
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
    if (user?.companyId?._id) {
      const response = await updateCompany({ id: user.companyId._id, payload: values });
      if (response && response.data) {
        dispatch(updateUserCompany(response.data));
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
        {user?.companyId && (
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
                  {user.companyId.logo ? (
                    <img 
                      src={getImageUrl(user.companyId.logo)} 
                      alt={user.companyId.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold">{user.companyId.name}</h4>
                  <div className="flex gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                    {user.companyId.gst && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> GST: {user.companyId.gst}
                      </span>
                    )}
                    {user.companyId.pan && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> PAN: {user.companyId.pan}
                      </span>
                    )}
                    {user.companyId.sences && (
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" /> License: {user.companyId.sences}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  {user.companyId.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.companyId.email}</span>
                    </div>
                  )}
                  {user.companyId.contactNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user.companyId.contactNumber}</span>
                    </div>
                  )}
                </div>
                
                {user.companyId.members !== undefined && (
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{user.companyId.members} Members</span>
                  </div>
                )}

                {(user.companyId.addressLine1 || user.companyId.city || user.companyId.state) && (
                  <div className="flex items-start gap-2 mt-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {user.companyId.addressLine1}
                      {user.companyId.addressLine2 && `, ${user.companyId.addressLine2}`}
                      <br />
                      {user.companyId.city && `${user.companyId.city}, `}
                      {user.companyId.state && `${user.companyId.state} `}
                      {user.companyId.pincode && `- ${user.companyId.pincode}`}
                      <br />
                      {user.companyId.country}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {user?.companyId && (
        <CompanyFormDrawer 
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSubmit={handleUpdateCompany}
          editCompanyId={user.companyId._id}
        />
      )}
    </div>
  );
}
