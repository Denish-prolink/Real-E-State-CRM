
import loginImage from "@/assets/logiinimage.png";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({
  children,
}: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-6">
        {children}
      </div>

      <div className="hidden lg:block bg-muted">
        <img
          src={loginImage}
          alt="login"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}