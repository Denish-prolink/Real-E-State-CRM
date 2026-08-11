import type { AddWarehousePayload, Warehouse } from "../types/warehouse.types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import type { Employee } from "@/pages/employees/types/employee.types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetEmployees } from "@/pages/employees/hooks/useGetEmployees";
import { warehouseSchema } from "../schemas/warehouse.schema";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddWarehousePayload) => void | Promise<void>;
  warehouseToEdit?: Warehouse | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddWarehousePayload = {
  warehouseCode: "",
  warehouseName: "",
  warehouseType: "Regular",
  manager: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  capacity: 0,
};

import { FormLabel, SectionTitle, FieldError } from "@/components/common/FormHelpers";
import { getInputClassName } from "@/components/common/formUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function WarehouseFormDrawer({
  open,
  onClose,
  onSubmit,
  warehouseToEdit,
  isSubmitting = false,
}: Props) {
  // Fetch employees to populate the dropdown
  const { data: employees, isLoading: loadingEmployees } = useGetEmployees();

  const formik = useFormik<AddWarehousePayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: warehouseSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        await onSubmit(values);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (warehouseToEdit) {
        formik.resetForm({
          values: {
            warehouseCode: warehouseToEdit.warehouseCode,
            warehouseName: warehouseToEdit.warehouseName,
            warehouseType: warehouseToEdit.warehouseType,
            manager: warehouseToEdit.manager?._id || "",
            addressLine1: warehouseToEdit.addressLine1,
            addressLine2: warehouseToEdit.addressLine2 || "",
            city: warehouseToEdit.city,
            state: warehouseToEdit.state,
            country: warehouseToEdit.country,
            pincode: warehouseToEdit.pincode,
            capacity: warehouseToEdit.capacity,
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, warehouseToEdit]);

  const inputCls = (field: keyof AddWarehousePayload) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {warehouseToEdit ? "Edit Warehouse" : "Add Warehouse"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {warehouseToEdit
                  ? "Update the details of the warehouse below."
                  : "Register a new warehouse facility."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="flex-1 px-6 pt-4 flex flex-col gap-5" noValidate>
          <SectionTitle>Basic Details</SectionTitle>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel htmlFor="warehouseCode" required>Warehouse Code</FormLabel>
                <Input
                  id="warehouseCode"
                  name="warehouseCode"
                  placeholder="e.g. WH-001"
                  value={formik.values.warehouseCode}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  className={inputCls("warehouseCode")}
                  disabled={!!warehouseToEdit}
                />
                <FieldError error={formik.errors.warehouseCode} touched={formik.touched.warehouseCode} submitCount={formik.submitCount} />
              </div>
              <div>
                <FormLabel htmlFor="capacity" required>Capacity</FormLabel>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  placeholder="e.g. 5000"
                  value={formik.values.capacity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("capacity")}
                />
                <FieldError error={formik.errors.capacity} touched={formik.touched.capacity} submitCount={formik.submitCount} />
              </div>
            </div>

            <div>
              <FormLabel htmlFor="warehouseName" required>Warehouse Name</FormLabel>
              <Input
                id="warehouseName"
                name="warehouseName"
                placeholder="e.g. Central Hub"
                value={formik.values.warehouseName}
                onChange={(e) => {
                  formik.handleChange(e);
                  const val = e.target.value;
                  if (val.length >= 50) {
                    formik.setFieldTouched("warehouseName", true, true);
                  } else {
                    formik.setFieldTouched("warehouseName", false, false);
                  }
                }}
                onBlur={formik.handleBlur}
                className={inputCls("warehouseName")}
              />
              <FieldError error={formik.errors.warehouseName} touched={formik.touched.warehouseName} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="warehouseType" required>Type</FormLabel>
              <Select
                value={formik.values.warehouseType}
                onValueChange={(val) => formik.setFieldValue("warehouseType", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("warehouseType"))}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Distribution Center">Distribution Center</SelectItem>
                  <SelectItem value="Cold Storage">Cold Storage</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.warehouseType} touched={formik.touched.warehouseType} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="manager" required>Manager</FormLabel>
              <Select
                value={formik.values.manager}
                onValueChange={(val) => formik.setFieldValue("manager", val)}
                disabled={loadingEmployees}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("manager"))}>
                  {formik.values.manager ?
                    <SelectValue placeholder="Select a manager">
                      {(() => {
                        const emp = employees?.find((e: Employee) => e._id === formik.values.manager);
                        return emp ? `${emp.firstName} ${emp.lastName}` : "";
                      })()}
                    </SelectValue> : <SelectValue placeholder="Select a manager" />}
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((employee: Employee) => (
                    <SelectItem key={employee._id} value={employee._id}>
                      {employee.firstName} {employee.lastName} ({employee.employeeCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.manager} touched={formik.touched.manager} submitCount={formik.submitCount} />
            </div>
            {formik.values.manager && (() => {
              const selectedEmp = employees?.find((emp: Employee) => emp._id === formik.values.manager);
              if (!selectedEmp) return null;
              return (
                <div className="bg-muted/30 p-3 rounded-lg border border-border flex flex-col gap-1.5 text-xs">
                  <p className="font-semibold text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Manager Contact Details</p>
                  <div>
                    <span className="font-medium text-foreground">Contact: </span>
                    <span className="text-muted-foreground">{selectedEmp.mobileNo}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Email: </span>
                    <span className="text-muted-foreground">{selectedEmp.email}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="flex flex-col gap-4">
            <SectionTitle>Address Information</SectionTitle>
            <div className="flex flex-col gap-4">
              <div>
                <FormLabel htmlFor="addressLine1" required>Address Line 1</FormLabel>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  placeholder="Example: Plot No. 12, GIDC"
                  value={formik.values.addressLine1}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("addressLine1")}
                />
                <FieldError error={formik.errors.addressLine1} touched={formik.touched.addressLine1} submitCount={formik.submitCount} />
              </div>

              <div>
                <FormLabel htmlFor="addressLine2">Address Line 2</FormLabel>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  placeholder="Example: Near Railway Station"
                  value={formik.values.addressLine2}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("addressLine2")}
                />
                <FieldError error={formik.errors.addressLine2} touched={formik.touched.addressLine2} submitCount={formik.submitCount} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel htmlFor="city" required>City</FormLabel>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Example: Surat"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputCls("city")}
                  />
                  <FieldError error={formik.errors.city} touched={formik.touched.city} submitCount={formik.submitCount} />
                </div>
                <div>
                  <FormLabel htmlFor="state" required>State</FormLabel>
                  <Input
                    id="state"
                    name="state"
                    placeholder="Example: Gujarat"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputCls("state")}
                  />
                  <FieldError error={formik.errors.state} touched={formik.touched.state} submitCount={formik.submitCount} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel htmlFor="country" required>Country</FormLabel>
                  <Input
                    id="country"
                    name="country"
                    placeholder="Example: India"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputCls("country")}
                  />
                  <FieldError error={formik.errors.country} touched={formik.touched.country} submitCount={formik.submitCount} />
                </div>
                <div>
                  <FormLabel htmlFor="pincode" required>Pincode</FormLabel>
                  <Input
                    id="pincode"
                    name="pincode"
                    placeholder="Example: 395003"
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputCls("pincode")}
                  />
                  <FieldError error={formik.errors.pincode} touched={formik.touched.pincode} submitCount={formik.submitCount} />
                </div>
              </div>
            </div>


          </div>

          <div className="sticky bottom-0 bg-card border-t border-border -mx-6 px-6 py-4 mt-auto flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                formik.resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-30"
            >
              {formik.isSubmitting || isSubmitting
                ? "Saving..."
                : warehouseToEdit
                  ? "Update Warehouse"
                  : "Add Warehouse"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
