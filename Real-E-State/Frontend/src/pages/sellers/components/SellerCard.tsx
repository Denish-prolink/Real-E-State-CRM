import { Edit2, Eye, Phone, Mail, MapPin, IndianRupee, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TruncatedName } from '@/components/common/TruncatedName';
import type { Seller } from '../types/seller.types';

interface SellerCardProps {
  seller: Seller;
  onEdit: (seller: Seller) => void;
  onDelete: (id: string) => void;
  onView: (seller: Seller) => void;
}

export default function SellerCard({ seller, onEdit, onDelete, onView }: SellerCardProps) {
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  };

  return (
    <div className="flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 border shadow-sm font-semibold text-sm ${getStatusColor(seller.status)}`}>
              {getInitials(seller.name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <TruncatedName name={seller.name} maxLength={18} className="font-semibold text-foreground text-lg" />
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase border ${getStatusColor(seller.status)}`}>
                  {seller.status || 'New'}
                </span>
                {seller.sellingReason && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase border bg-amber-50 text-amber-700 border-amber-200">
                    {seller.sellingReason}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1.5 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 rounded-lg">
                <DropdownMenuItem onClick={() => onView(seller)} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(seller)} className="cursor-pointer">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(seller._id)} className="cursor-pointer text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2 border-t border-border/50 pt-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0 text-indigo-500" />
            <span className="truncate">{seller.phone}</span>
          </div>
          {seller.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0 text-indigo-500" />
              <span className="truncate">{seller.email}</span>
            </div>
          )}
          {seller.expectedPrice && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IndianRupee className="h-4 w-4 shrink-0 text-indigo-500" />
              <span className="truncate font-semibold text-indigo-600">₹{seller.expectedPrice.toLocaleString('en-IN')}</span>
            </div>
          )}
          {seller.property && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-indigo-500" />
              <span className="truncate">Property: {seller.property}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
