import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (email: string, firstName: string, lastName: string) => void;
}

export default function GoogleLoginModal({
  isOpen,
  onClose,
  onSelect,
}: GoogleLoginModalProps) {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const demoAccounts = [
    { email: "shrusti.prolink@gmail.com", firstName: "Shrusti", lastName: "Prolink" },
    { email: "admin.inventory@gmail.com", firstName: "Admin", lastName: "Real-E-State CRM" },
    { email: "guest.user@gmail.com", firstName: "Guest", lastName: "User" },
  ];

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      setError("All fields are required");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    onSelect(email, firstName, lastName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col transition-all duration-300 transform scale-100 scale-in">

        {/* Header with Google Logo */}
        <div className="p-8 pb-4 flex flex-col items-center text-center">
          <svg className="h-8 w-8 mb-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 font-sans">
            Sign in with Google
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            to continue to Real-E-State CRM
          </p>
        </div>

        {/* Content Area */}
        <div className="px-8 py-4 flex-1">
          {!showCustomForm ? (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                Choose an account
              </span>
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => onSelect(account.email, account.firstName, account.lastName)}
                  className="flex items-center gap-3 p-3 w-full text-left rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-150 group"
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-semibold text-sm group-hover:scale-105 transition-transform">
                    {account.firstName[0]}
                    {account.lastName[0]}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {account.firstName} {account.lastName}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {account.email}
                    </span>
                  </div>
                </button>
              ))}

              <button
                onClick={() => setShowCustomForm(true)}
                className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-center hover:underline"
              >
                Use another account
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitCustom} className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Enter account details
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">First Name</label>
                  <Input
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Last Name</label>
                  <Input
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Email Address</label>
                <Input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCustomForm(false);
                    setError("");
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Sign In
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Developer Sandbox Notice Banner */}
        <div className="mx-8 mb-4 mt-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/50 flex flex-col gap-1 text-[11px] text-amber-800 dark:text-amber-300">
          <div className="font-semibold flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Google OAuth Sandbox Mode
          </div>
          <p className="opacity-90 leading-normal">
            To connect to your live Google accounts, please add <code className="bg-amber-100/55 dark:bg-amber-900/50 px-1 rounded font-mono">VITE_GOOGLE_CLIENT_ID</code> to your Frontend environment config.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 px-8 py-4 flex justify-end">
          <Button variant="ghost" onClick={onClose} size="sm" className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
