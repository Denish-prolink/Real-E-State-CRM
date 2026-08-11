import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { forgotPasswordSchema } from "../schemas/password.schema";
import { useFormik } from "formik";
import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { mutate, isPending } = useForgotPassword();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: (values) => {
      mutate(values.email);
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
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to receive a password reset link
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
            placeholder="m@example.com" 
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500">{formik.errors.email}</p>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={isPending} className="w-full">
             {isPending ? "Sending..." : "Send Reset Link"}
          </Button>
        </Field>
        <div className="text-center text-sm">
          Remember your password?{" "}
          <Link to="/login" className="underline underline-offset-4">
            Back to login
          </Link>
        </div>
        <div className="text-center text-sm mt-2">
          Already have a token?{" "}
          <Link to="/reset-password" className="underline underline-offset-4">
            Reset Password
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
