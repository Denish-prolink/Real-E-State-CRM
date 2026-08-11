import { useState } from "react";
import { useFormik } from "formik";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { registerSchema } from "../schemas/register.schema";
import { useRegister } from "../hooks/useRegister";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import GoogleLoginModal from "./GoogleLoginModal";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { mutate, isPending } = useRegister();
  const navigate = useNavigate();
  const { signInWithGoogle, isPending: isGooglePending } = useGoogleAuth();
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleGoogleClick = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId || googleClientId === "your_google_client_id") {
      setIsGoogleModalOpen(true);
    } else {
      signInWithGoogle();
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: () => {
          navigate("/login");
        }
      });
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  return (
    <form 
      className={cn("flex flex-col gap-6 w-full max-w-sm", className)} 
      onSubmit={formik.handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Input 
              id="firstName" 
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="John" 
              className={formik.errors.firstName && formik.touched.firstName ? "border-red-500" : ""}
            />
            {formik.errors.firstName && (formik.touched.firstName || formik.submitCount > 0) && (
              <p className="text-sm text-red-500">{formik.errors.firstName}</p>
            )}
          </Field>
          
          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input 
              id="lastName" 
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Doe" 
              className={formik.errors.lastName && formik.touched.lastName ? "border-red-500" : ""}
            />
            {formik.errors.lastName && (formik.touched.lastName || formik.submitCount > 0) && (
              <p className="text-sm text-red-500">{formik.errors.lastName}</p>
            )}
          </Field>
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
            className={formik.errors.email && formik.touched.email ? "border-red-500" : ""}
          />
          {formik.errors.email && (formik.touched.email || formik.submitCount > 0) && (
            <p className="text-sm text-red-500">{formik.errors.email}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input 
            id="password" 
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.errors.password && formik.touched.password ? "border-red-500" : ""}
          />
          {formik.errors.password && (formik.touched.password || formik.submitCount > 0) && (
            <p className="text-sm text-red-500">{formik.errors.password}</p>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={isPending} className="w-full">
             {isPending ? "Signing up..." : "Sign Up"}
          </Button>
        </Field>
        
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button 
            variant="outline" 
            type="button" 
            className="w-full"
            onClick={handleGoogleClick}
            disabled={isPending || isGooglePending}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </Button>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="underline underline-offset-4"
            >
              Log in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>

      <GoogleLoginModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelect={(email, firstName, lastName) => {
          formik.setValues({
            ...formik.values,
            email,
            firstName,
            lastName,
          });
          setIsGoogleModalOpen(false);
        }}
      />
    </form>
  );
}
