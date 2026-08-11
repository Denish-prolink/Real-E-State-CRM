import { Eye, EyeOff, ImageIcon, UploadCloud, X } from "lucide-react";
import {
  FieldError,
  FormLabel,
  SectionTitle,
} from "@/components/common/FormHelpers";
import { getInputClassName } from "@/components/common/formUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn, getImageUrl } from "@/lib/utils";
import { useEffect, useState } from "react";

import type { AddCompanyPayload } from "../types/company.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { companySchema, companyUpdateSchema } from "../schemas/company.schema";
import { uploadCompanyLogoApi } from "../api/company.api";
import { useFormik } from "formik";
import { useGetCompany } from "../hooks/useGetCompany";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddCompanyPayload) => void | Promise<void>;
  editCompanyId?: string | null;
}

const EMPTY_VALUES: AddCompanyPayload = {
  name: "",
  gst: "",
  sences: "",
  pan: "",
  members: 1,
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  contactNumber: "",
  email: "",
  logo: "",
  status: "active",
  logoFile: null,
  password: "",
};

export default function CompanyFormDrawer({
  open,
  onClose,
  onSubmit,
  editCompanyId,
}: Props) {
  const { data: company, isLoading: isCompanyLoading } = useGetCompany(
    editCompanyId || null,
  );
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<AddCompanyPayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: editCompanyId ? companyUpdateSchema : companySchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        if (editCompanyId && !formik.dirty) {
          // toast.info("No changes made");
          onClose();
          return;
        }

        let finalLogoUrl = values.logo;
        if (values.logoFile) {
          const formData = new FormData();
          formData.append("logo", values.logoFile);
          const uploadRes = await uploadCompanyLogoApi(formData);
          if (uploadRes.success) {
            finalLogoUrl = uploadRes.data.url;
          }
        }

        const payload = { ...values, logo: finalLogoUrl };
        delete payload.logoFile;
        await onSubmit(payload);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (editCompanyId) {
        if (company) {
          formik.resetForm({
            values: {
              name: company.name,
              gst: company.gst || "",
              sences: company.sences || "",
              pan: company.pan || "",
              members: company.members || 0,
              addressLine1: company.addressLine1 || "",
              addressLine2: company.addressLine2 || "",
              city: company.city || "",
              state: company.state || "",
              country: company.country || "",
              pincode: company.pincode || "",
              contactNumber: company.contactNumber || "",
              email: company.email || "",
              logo: company.logo || "",
              status: company.status || "active",
              logoFile: null,
              password: "",
            },
          });
        }
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
        setTimeout(() => {
          setShowPassword(false);
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editCompanyId, company]);

  const inputCls = (field: keyof AddCompanyPayload) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="right"
        className="w--full sm:max-w-2xl overflow-y-auto p-0 flex flex-col"
      >
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {editCompanyId ? "Edit Company" : "Add Company"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {editCompanyId
                  ? "Update the details of the company below."
                  : "Create a new company in your system."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="flex-1 px-6 pt-4 flex flex-col gap-5"
          noValidate
        >
          {/* ── LOGO ── */}
          <SectionTitle>Company Logo</SectionTitle>
          <div className="flex flex-col gap-4">
            <div>
              <FormLabel htmlFor="logo">Logo Image</FormLabel>
              <div className="flex flex-col gap-3 mt-1">
                {!formik.values.logo && !formik.values.logoFile ? (
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          formik.setFieldValue("logoFile", file);
                          formik.setFieldValue(
                            "logo",
                            URL.createObjectURL(file),
                          );
                        }
                        e.target.value = "";
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/10 py-6 hover:bg-muted/30 hover:border-indigo-300 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center mb-2 shadow-sm border border-border">
                        <UploadCloud className="h-5 w-5 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        Tap to upload logo
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        PNG, JPG (max. 5MB)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative group rounded-lg overflow-hidden border border-border w-32 h-32 bg-muted">
                    <img
                      src={
                        formik.values.logo?.startsWith("blob:")
                          ? formik.values.logo
                          : getImageUrl(formik.values.logo || "")
                      }
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        formik.setFieldValue("logo", "");
                        formik.setFieldValue("logoFile", null);
                      }}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      <ImageIcon className="h-6 w-6 text-white drop-shadow" />
                    </div>
                  </div>
                )}
                <FieldError
                  error={formik.errors.logo}
                  touched={formik.touched.logo}
                  submitCount={formik.submitCount}
                />
              </div>
            </div>
          </div>

          {/* ── BASIC INFO ── */}
          <SectionTitle>Basic Information</SectionTitle>
          <div className="flex flex-col gap-4">
            <div>
              <FormLabel htmlFor="name" required>
                Name
              </FormLabel>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Acme Corp"
                value={formik.values.name}
                onChange={(e) => {
                  formik.handleChange(e);
                  const val = e.target.value;
                  if (val.length >= 50) {
                    formik.setFieldTouched("name", true, true);
                  } else {
                    formik.setFieldTouched("name", false, false);
                  }
                }}
                onBlur={formik.handleBlur}
                className={inputCls("name")}
              />
              <FieldError
                error={formik.errors.name}
                touched={formik.touched.name}
                submitCount={formik.submitCount}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel htmlFor="gst">GST Number</FormLabel>
                <Input
                  id="gst"
                  name="gst"
                  placeholder="GSTIN"
                  value={formik.values.gst}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("gst")}
                />
                <FieldError
                  error={formik.errors.gst}
                  touched={formik.touched.gst}
                  submitCount={formik.submitCount}
                />
              </div>
              <div>
                <FormLabel htmlFor="pan">PAN Number</FormLabel>
                <Input
                  id="pan"
                  name="pan"
                  placeholder="PAN"
                  value={formik.values.pan}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("pan")}
                />
                <FieldError
                  error={formik.errors.pan}
                  touched={formik.touched.pan}
                  submitCount={formik.submitCount}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel htmlFor="sences">Licenses/Sences</FormLabel>
                <Input
                  id="sences"
                  name="sences"
                  placeholder="Licenses Info"
                  value={formik.values.sences}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("sences")}
                />
                <FieldError
                  error={formik.errors.sences}
                  touched={formik.touched.sences}
                  submitCount={formik.submitCount}
                />
              </div>
              <div>
                <FormLabel htmlFor="members" required>
                  Members
                </FormLabel>
                <Input
                  id="members"
                  name="members"
                  type="number"
                  placeholder="0"
                  value={formik.values.members}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("members")}
                />
                <FieldError
                  error={formik.errors.members}
                  touched={formik.touched.members}
                  submitCount={formik.submitCount}
                />
              </div>
            </div>
          </div>

          {/* ── CONTACT INFO ── */}
          <SectionTitle>Contact Information</SectionTitle>
          <div className="flex flex-col gap-4">
            <div>
              <FormLabel htmlFor="contactNumber" required>
                Contact Number
              </FormLabel>
              <Input
                id="contactNumber"
                name="contactNumber"
                placeholder="e.g. 9876543210"
                value={formik.values.contactNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("contactNumber")}
              />
              <FieldError
                error={formik.errors.contactNumber}
                touched={formik.touched.contactNumber}
                submitCount={formik.submitCount}
              />
            </div>
            <div>
              <FormLabel htmlFor="email" required>
                Email
              </FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. warehouse@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("email")}
                disabled={!!editCompanyId}
                autoComplete="off"
              />
              <FieldError
                error={formik.errors.email}
                touched={formik.touched.email}
                submitCount={formik.submitCount}
              />
            </div>
            <div>
              <FormLabel htmlFor="password" required={!editCompanyId}>
                {editCompanyId ? "Change Password" : "Login Password"}
              </FormLabel>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    editCompanyId
                      ? "Leave blank to keep same"
                      : "Set a password for login"
                  }
                  value={formik.values.password || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(inputCls("password"), "pr-10")}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError
                error={formik.errors.password}
                touched={formik.touched.password}
                submitCount={formik.submitCount}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {editCompanyId
                  ? "Type a new password to change it."
                  : "Fill this to allow company login."}
              </p>
            </div>
          </div>

          {/* ── ADDRESS INFO ── */}
          <SectionTitle>Address Information</SectionTitle>
          <div className="flex flex-col gap-4">
            <div>
              <FormLabel htmlFor="addressLine1" required>
                Address Line 1
              </FormLabel>
              <Input
                id="addressLine1"
                name="addressLine1"
                placeholder="e.g. Plot No. 12, GIDC"
                value={formik.values.addressLine1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("addressLine1")}
              />
              <FieldError
                error={formik.errors.addressLine1}
                touched={formik.touched.addressLine1}
                submitCount={formik.submitCount}
              />
            </div>

            <div>
              <FormLabel htmlFor="addressLine2">Address Line 2</FormLabel>
              <Input
                id="addressLine2"
                name="addressLine2"
                placeholder="e.g. Near Railway Station"
                value={formik.values.addressLine2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("addressLine2")}
              />
              <FieldError
                error={formik.errors.addressLine2}
                touched={formik.touched.addressLine2}
                submitCount={formik.submitCount}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel htmlFor="city" required>
                  City
                </FormLabel>
                <Input
                  id="city"
                  name="city"
                  placeholder="e.g. Surat"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("city")}
                />
                <FieldError
                  error={formik.errors.city}
                  touched={formik.touched.city}
                  submitCount={formik.submitCount}
                />
              </div>
              <div>
                <FormLabel htmlFor="state" required>
                  State
                </FormLabel>
                <Input
                  id="state"
                  name="state"
                  placeholder="e.g. Gujarat"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("state")}
                />
                <FieldError
                  error={formik.errors.state}
                  touched={formik.touched.state}
                  submitCount={formik.submitCount}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel htmlFor="country" required>
                  Country
                </FormLabel>
                <Input
                  id="country"
                  name="country"
                  placeholder="e.g. India"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("country")}
                />
                <FieldError
                  error={formik.errors.country}
                  touched={formik.touched.country}
                  submitCount={formik.submitCount}
                />
              </div>
              <div>
                <FormLabel htmlFor="pincode" required>
                  Pincode
                </FormLabel>
                <Input
                  id="pincode"
                  name="pincode"
                  placeholder="e.g. 395007"
                  value={formik.values.pincode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("pincode")}
                />
                <FieldError
                  error={formik.errors.pincode}
                  touched={formik.touched.pincode}
                  submitCount={formik.submitCount}
                />
              </div>
            </div>

            {editCompanyId && (
              <div>
                <FormLabel htmlFor="status" required>
                  Status
                </FormLabel>
                <Select
                  value={formik.values.status}
                  onValueChange={(val) => formik.setFieldValue("status", val)}
                >
                  <SelectTrigger
                    className={cn("w-full h-9", inputCls("status"))}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError
                  error={formik.errors.status}
                  touched={formik.touched.status}
                  submitCount={formik.submitCount}
                />
              </div>
            )}
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
              disabled={formik.isSubmitting || isCompanyLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-30"
            >
              {formik.isSubmitting || isCompanyLoading
                ? "Saving..."
                : editCompanyId
                  ? "Update Company"
                  : "Add Company"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
