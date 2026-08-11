import type { AddCompanyPayload, Company } from "../types/company.types";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import CompanyFormDrawer from "../components/CompanyFormDrawer";
import CompanyTable from "../components/CompanyTable";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import TablePagination from "@/components/common/TablePagination";
import { useAddCompany } from "../hooks/useAddCompany";
import { useDebounce } from "@/hooks/useDebounce";
import { useDeleteCompany } from "../hooks/useDeleteCompany";
import { useGetCompanies } from "../hooks/useGetCompanies";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUpdateCompany } from "../hooks/useUpdateCompany";

const PAGE_SIZE = 10;

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: paginationData, isLoading, isFetching } = useGetCompanies({
    page: currentPage,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  const companies: Company[] = paginationData?.data || [];
  const total = paginationData?.meta.total || 0;
  const page = paginationData?.meta.page || 1;

  const addMutation = useAddCompany();
  const updateMutation = useUpdateCompany();
  const deleteMutation = useDeleteCompany();

  const handleAddOrEdit = async (values: AddCompanyPayload) => {
    if (editTargetId) {
      await updateMutation.mutateAsync({ id: editTargetId, payload: values });
    } else {
      await addMutation.mutateAsync(values);
    }
    setEditTargetId(null);
    setDrawerOpen(false);
  };

  const openEdit = (company: Company) => {
    setEditTargetId(company._id);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteMutation.mutateAsync(deleteId);
        setDeleteId(null);
      } catch {
        // Ignored
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} total companies</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => {
              setEditTargetId(null);
              setDrawerOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search companies by name, GST or PAN..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <CompanyTable
            companies={companies}
            isLoading={isLoading || isFetching}
            onEdit={openEdit}
            onDelete={setDeleteId}
            onView={(company) => navigate(`/companies/${company._id}`)}
            startIndex={(page - 1) * PAGE_SIZE}
          />
        </div>

        {/* Server-side Pagination */}
        {!(isLoading || isFetching) && total > 0 && (
          <TablePagination
            currentPage={page}
            totalItems={total}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="companies"
          />
        )}
      </div>

      {/* Form Drawer */}
      <CompanyFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTargetId(null);
        }}
        onSubmit={handleAddOrEdit}
        editCompanyId={editTargetId}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title="Delete Company"
        description="Are you sure you want to permanently delete this company? This action cannot be undone."
      />
    </div>
  );
}
