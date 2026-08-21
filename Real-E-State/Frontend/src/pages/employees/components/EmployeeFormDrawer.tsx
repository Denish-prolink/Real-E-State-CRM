import { useEffect } from "react";
import { useFormik } from "formik";
import { employeeSchema } from "../schemas/employee.schema";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AddEmployeePayload, Employee } from "../types/employee.types";

import { useGetEmployeeById } from "../hooks/useGetEmployeeById";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddEmployeePayload) => void | Promise<void>;
  employeeToEdit?: Employee | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddEmployeePayload = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  mobileNo: "",
  email: "",
  department: "",
  designation: "",
  joiningDate: new Date().toISOString().split('T')[0],
  gender: "",
  dob: "",
  address: "",
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


export default function EmployeeFormDrawer({
  open,
  onClose,
  onSubmit,
  employeeToEdit,
  isSubmitting = false,
}: Props) {
  const { data: fetchedEmployee } = useGetEmployeeById(
    employeeToEdit?._id || "",
    { enabled: open && !!employeeToEdit?._id }
  );

  const formik = useFormik<AddEmployeePayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: employeeSchema,
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
      if (employeeToEdit) {
        const employeeData = fetchedEmployee || employeeToEdit;
        formik.resetForm({
          values: {
            employeeCode: employeeData.employeeCode,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            mobileNo: employeeData.mobileNo,
            email: employeeData.email,
            department: employeeData.department,
            designation: employeeData.designation,
            joiningDate: new Date(employeeData.joiningDate).toISOString().split('T')[0],
            gender: employeeData.gender || "",
            dob: employeeData.dob ? new Date(employeeData.dob).toISOString().split('T')[0] : "",
            address: employeeData.address || "",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, employeeToEdit, fetchedEmployee]);

  const inputCls = (field: keyof AddEmployeePayload) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {employeeToEdit ? "Edit Employee" : "Add Employee"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {employeeToEdit
                  ? "Update the details of the employee below."
                  : "Register a new employee in the system."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="flex-1 px-6 pt-4 flex flex-col gap-5" noValidate>
          <SectionTitle>Basic Information</SectionTitle>
          <div className="flex flex-col gap-4">
            <div>
              <FormLabel htmlFor="employeeCode" required>Employee Code</FormLabel>
              <Input
                id="employeeCode"
                name="employeeCode"
                placeholder="e.g. EMP-001"
                value={formik.values.employeeCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("employeeCode")}
                disabled={!!employeeToEdit} // Generally employee code is not edited
              />
              <FieldError error={formik.errors.employeeCode} touched={formik.touched.employeeCode} submitCount={formik.submitCount} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel htmlFor="firstName" required>First Name</FormLabel>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="e.g. John"
                  value={formik.values.firstName}
                  onChange={(e) => {
                    formik.handleChange(e);
                    const val = e.target.value;
                    if (val.length >= 50) {
                      formik.setFieldTouched("firstName", true, true);
                    } else {
                      formik.setFieldTouched("firstName", false, false);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  className={inputCls("firstName")}
                />
                <FieldError error={formik.errors.firstName} touched={formik.touched.firstName} submitCount={formik.submitCount} />
              </div>
              <div>
                <FormLabel htmlFor="lastName" required>Last Name</FormLabel>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="e.g. Doe"
                  value={formik.values.lastName}
                  onChange={(e) => {
                    formik.handleChange(e);
                    const val = e.target.value;
                    if (val.length >= 50) {
                      formik.setFieldTouched("lastName", true, true);
                    } else {
                      formik.setFieldTouched("lastName", false, false);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  className={inputCls("lastName")}
                />
                <FieldError error={formik.errors.lastName} touched={formik.touched.lastName} submitCount={formik.submitCount} />
              </div>
            </div>
          </div>

          <SectionTitle>Contact Details</SectionTitle>
          <div className="flex flex-col gap-4">
            <div>
              <FormLabel htmlFor="mobileNo" required>Mobile Number</FormLabel>
              <Input
                id="mobileNo"
                name="mobileNo"
                placeholder="e.g. 9876543210"
                value={formik.values.mobileNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("mobileNo")}
              />
              <FieldError error={formik.errors.mobileNo} touched={formik.touched.mobileNo} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="email" required>Email Address</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. employee@agency.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("email")}
              />
              <FieldError error={formik.errors.email} touched={formik.touched.email} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="address">Address</FormLabel>
              <Input
                id="address"
                name="address"
                placeholder="e.g. 123 Main St, Springfield"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("address")}
              />
              <FieldError error={formik.errors.address} touched={formik.touched.address} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Employment Details</SectionTitle>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel htmlFor="department" required>Department</FormLabel>
                <Input
                  id="department"
                  name="department"
                  placeholder="e.g. Sales"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("department")}
                />
                <FieldError error={formik.errors.department} touched={formik.touched.department} submitCount={formik.submitCount} />
              </div>
              <div>
                <FormLabel htmlFor="designation" required>Designation</FormLabel>
                <Input
                  id="designation"
                  name="designation"
                  placeholder="e.g. Manager"
                  value={formik.values.designation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("designation")}
                />
                <FieldError error={formik.errors.designation} touched={formik.touched.designation} submitCount={formik.submitCount} />
              </div>
            </div>

            <div>
              <FormLabel htmlFor="joiningDate" required>Joining Date</FormLabel>
              <Input
                id="joiningDate"
                name="joiningDate"
                type="date"
                value={formik.values.joiningDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("joiningDate")}
              />
              <FieldError error={formik.errors.joiningDate} touched={formik.touched.joiningDate} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Additional Details</SectionTitle>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel htmlFor="gender" required>Gender</FormLabel>
                <Select
                  value={formik.values.gender}
                  onValueChange={(val) => formik.setFieldValue("gender", val)}
                >
                  <SelectTrigger className={cn("w-full h-9", inputCls("gender"))}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError error={formik.errors.gender} touched={formik.touched.gender} submitCount={formik.submitCount} />
              </div>
              <div>
                <FormLabel htmlFor="dob">Date of Birth</FormLabel>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  max={new Date().toLocaleDateString('en-CA')}
                  value={formik.values.dob}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("dob")}
                />
                <FieldError error={formik.errors.dob} touched={formik.touched.dob} submitCount={formik.submitCount} />
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
                : employeeToEdit
                  ? "Update Employee"
                  : "Add Employee"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
