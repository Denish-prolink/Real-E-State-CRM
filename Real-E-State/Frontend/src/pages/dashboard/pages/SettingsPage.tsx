import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your organization settings, API connections, and preferences.
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Profile Settings */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-4">General Preferences</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Warehouse Name</label>
              <input
                type="text"
                defaultValue="Main Gujarat Warehouse"
                className="h-9 rounded-lg border border-border px-3 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Alert Notifications Email</label>
              <input
                type="email"
                defaultValue="admin@prolink.com"
                className="h-9 rounded-lg border border-border px-3 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <Button className="w-fit mt-2">Save Changes</Button>
          </div>
        </div>

        {/* Integration API Settings */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-2">API Credentials</h2>
          <p className="text-xs text-muted-foreground mb-4">Keys for sync tools and barcode scanners.</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Production Access Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  disabled
                  value="••••••••••••••••••••••••••••••••"
                  className="flex-1 h-9 rounded-lg border border-border px-3 text-sm bg-muted/40"
                />
                <Button variant="outline">Reveal</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
