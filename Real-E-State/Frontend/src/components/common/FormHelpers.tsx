import React from "react";

interface FormLabelProps {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormLabel({ htmlFor, required, children }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium text-foreground mb-1 block"
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3 py-2 mt-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {children}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

interface FieldErrorProps {
  error?: string;
  touched?: boolean;
  submitCount: number;
}

export function FieldError({ error, touched, submitCount }: FieldErrorProps) {
  if (!error || (!touched && submitCount === 0)) return null;
  return <p className="text-xs text-red-500 mt-1">{error}</p>;
}
