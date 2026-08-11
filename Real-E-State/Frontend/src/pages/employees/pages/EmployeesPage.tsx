import type { AddEmployeePayload, Employee } from "../types/employee.types";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmployeeFormDrawer from "../components/EmployeeFormDrawer";
import EmployeeTable from "../components/EmployeeTable";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { useAddEmployee } from "../hooks/useAddEmployee";
import { useDeleteEmployee } from "../hooks/useDeleteEmployee";
import { useGetEmployees } from "../hooks/useGetEmployees";
import { useState } from "react";
import { useUpdateEmployee } from "../hooks/useUpdateEmployee";
import { useDebounce } from "@/hooks/useDebounce";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: employeesResponse, isLoading, isFetching } = useGetEmployees(debouncedSearch || undefined);
  const employees = employeesResponse || [];

  const addEmployeeMutation = useAddEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  const handleAddOrEdit = async (values: AddEmployeePayload) => {
    try {
      if (editTargetId) {
        await updateEmployeeMutation.mutateAsync({ id: editTargetId._id, payload: values });
        toast.success("Employee updated successfully");
      } else {
        await addEmployeeMutation.mutateAsync(values);
        toast.success("Employee created successfully");
      }
      setEditTargetId(null);
      setDrawerOpen(false);
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(axiosError.response?.data?.message || axiosError.message || "Failed to submit employee data");
    }
  };

  const openEdit = (employee: Employee) => {
    setEditTargetId(employee);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteEmployeeMutation.mutateAsync(deleteId);
        toast.success("Employee deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete employee");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {employees.length} total employees
          </p>
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
            Add Employee
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name, phone..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <EmployeeTable
          employees={employees}
          isLoading={isLoading || isFetching}
          onEdit={openEdit}
          onDelete={setDeleteId}
        />
      </div>

      {/* Drawer */}
      <EmployeeFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTargetId(null);
        }}
        onSubmit={handleAddOrEdit}
        employeeToEdit={editTargetId}
        isSubmitting={addEmployeeMutation.isPending || updateEmployeeMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteEmployeeMutation.isPending}
        title="Delete Employee"
        description="Are you sure you want to permanently delete this employee? This action cannot be undone."
      />
    </div>
  );
}
