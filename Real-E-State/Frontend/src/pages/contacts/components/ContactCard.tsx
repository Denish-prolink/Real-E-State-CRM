import { Edit2, Eye, Mail, Phone, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TruncatedName } from '@/components/common/TruncatedName';
import type { Contact } from '../types/contact.types';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onView: (contact: Contact) => void;
}

export default function ContactCard({ contact, onEdit, onDelete, onView }: ContactCardProps) {

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'customer':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'supplier':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'vendor':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'seller':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 border shadow-sm font-semibold text-sm ${getTypeColor(contact.type)}`}>
              {getInitials(contact.name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <TruncatedName name={contact.name} maxLength={15} className="font-semibold text-foreground text-lg" />
              </div>
              <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase border ${getTypeColor(contact.type)}`}>
                {contact.type}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1.5 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-md transition-colors cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 rounded-lg">
                <DropdownMenuItem onClick={() => onView(contact)} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(contact)} className="cursor-pointer">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(contact._id)} className="cursor-pointer text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0 text-indigo-500" />
            <span className="truncate">{contact.mobileNo}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0 text-indigo-500" />
            <span className="truncate">{contact.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
