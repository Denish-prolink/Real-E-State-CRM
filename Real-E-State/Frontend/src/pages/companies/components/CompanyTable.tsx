import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TruncatedName } from "@/components/common/TruncatedName";
import { Edit2, Trash2, Building2, Eye, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Company } from "../types/company.types";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { getImageUrl } from "@/lib/utils";

interface Props {
  companies: Company[];
  isLoading: boolean;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  onView: (company: Company) => void;
  startIndex?: number;
}

export default function CompanyTable({ companies, isLoading, onEdit, onDelete, onView, startIndex = 0 }: Props) {
  return (
    <div>
      <div className="rounded-t-xl rounded-b-none border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>GST</TableHead>
              <TableHead>PAN</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={8} />
            ) : companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Building2 className="h-10 w-10 text-muted-foreground/30" />
                    <p className="font-medium">No companies found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company, index) => (
                <TableRow key={company._id}>
                  <TableCell>{startIndex + index + 1}</TableCell>

                  <TableCell>
                    <div 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => onView(company)}
                    >
                      {company.logo ? (
                        <img
                          src={getImageUrl(company.logo)}
                          alt={company.name || "Company"}
                          className="h-10 w-10 rounded-lg object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                          {company.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <TruncatedName name={company.name || "-"} maxLength={20} className="font-medium text-indigo-600 dark:text-indigo-400 " />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{company.contactNumber || "-"}</TableCell>

                  <TableCell>{company.gst || "-"}</TableCell>

                  <TableCell>{company.pan || "-"}</TableCell>

                  <TableCell>{company.members ?? "-"}</TableCell>

                  <TableCell>
                    <Badge variant={company.status === "active" ? "default" : "secondary"} className={company.status === "active" ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" : ""}>
                      {company.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted cursor-pointer transition-colors">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 rounded-lg">
                          <DropdownMenuItem onClick={() => onView(company)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit(company)} className="cursor-pointer">
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete(company._id)} className="cursor-pointer text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
