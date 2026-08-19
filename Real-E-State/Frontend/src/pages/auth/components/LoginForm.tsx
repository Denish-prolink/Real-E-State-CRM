import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { loginSchema } from "../schemas/login.schema";
import { useFormik } from "formik";
import { useLogin } from "../hooks/useLogin";
import { useState } from "react";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { mutate, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
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
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
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
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              to="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="pr-10"
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
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm text-red-500">{formik.errors.password}</p>
          )}
        </Field>
        <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 p-4 text-sm">
          <p className="font-medium text-foreground mb-3">Quick Login (Demo)</p>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => {
                formik.setFieldValue("email", "superadmin@example.com");
                formik.setFieldValue("password", "password123");
              }}
            >
              <span className="font-semibold w-24 text-left">Super Admin:</span> superadmin@example.com
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => {
                formik.setFieldValue("email", "agency@acme.com");
                formik.setFieldValue("password", "password123");
              }}
            >
              <span className="font-semibold w-24 text-left">Agency:</span> agency@acme.com
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => {
                formik.setFieldValue("email", "staff@acme.com");
                formik.setFieldValue("password", "password123");
              }}
            >
              <span className="font-semibold w-24 text-left">Staff:</span> staff@acme.com
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => {
                formik.setFieldValue("email", "agent@acme.com");
                formik.setFieldValue("password", "password123");
              }}
            >
              <span className="font-semibold w-24 text-left">Agent:</span> agent@acme.com
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => {
                formik.setFieldValue("email", "user@acme.com");
                formik.setFieldValue("password", "password123");
              }}
            >
              <span className="font-semibold w-24 text-left">User:</span> user@acme.com
            </Button>
          </div>
        </div>
        <Field>
          <Button type="submit" disabled={isPending} className="w-full">
             {isPending ? <Loader2/>: "Login"}
          </Button>
       </Field>
       
    </FieldGroup>
    </form>
  )
  };