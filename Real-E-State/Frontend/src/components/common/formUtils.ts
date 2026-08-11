import { cn } from "@/lib/utils";

const getNestedValue = (obj: unknown, path: string): unknown => {
  if (!obj || typeof obj !== "object") return undefined;
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
};

export function getInputClassName(
  errors: unknown,
  touched: unknown,
  submitCount: number,
  fieldName: string,
  baseClass = "w-full bg-muted/10 border-border focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500",
  errorClass = "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
) {
  const error = getNestedValue(errors, fieldName);
  const touch = getNestedValue(touched, fieldName);
  const hasError = !!error && (!!touch || submitCount > 0);

  return cn(baseClass, hasError && errorClass);
}
