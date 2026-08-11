import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { resetPasswordSchema } from "../schemas/password.schema";
import { useFormik } from "formik";
import { useResetPassword } from "../hooks/useResetPassword";

export default function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { mutate, isPending } = useResetPassword();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });

  return (
    <form 
      className={cn("flex flex-col gap-6 w-full max-w-sm", className)} 
      onSubmit={formik.handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email and your new password
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input 
            id="email" 
            type="email" 
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your email" 
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500">{formik.errors.email}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <Input 
            id="password" 
            type="password" 
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter new password" 
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm text-red-500">{formik.errors.password}</p>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={isPending} className="w-full">
             {isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </Field>
        <div className="text-center text-sm">
          <Link to="/login" className="underline underline-offset-4">
            Back to login
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
