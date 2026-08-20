import { useMemo } from "react";
import { LayoutDashboard, Users, Building2, UserPlus, FileText, ArrowRight, Activity, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { useGetLeads } from "../../leads/hooks/useGetLeads";
import { useGetProperties } from "../../properties/hooks/useProperties";
import { useGetProjects } from "../../projects/hooks/useProjects";
import { useGetContacts } from "../../contacts/hooks/useGetContacts";
import type { Lead } from "../../leads/types/lead.types";

const COLORS = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];

export default function DashboardOverview() {
  const navigate = useNavigate();

  // Fetch CRM Data
  const { data: leadsResponse, isLoading: leadsLoading } = useGetLeads({ page: 1, perPage: 100 });
  const { data: propertiesData, isLoading: propertiesLoading } = useGetProperties();
  const { data: projectsData, isLoading: projectsLoading } = useGetProjects();
  const { data: contactsResponse, isLoading: contactsLoading } = useGetContacts({ page: 1, perPage: 1 });

  const isLoading = leadsLoading || propertiesLoading || projectsLoading || contactsLoading;

  // Type coercions
  const leadsData = leadsResponse as { leads: Lead[]; total: number } | undefined;
  const propertiesList = propertiesData as any[] | undefined;
  const projectsList = projectsData as any[] | undefined;
  const contactsData = contactsResponse as { total: number } | { contacts: any[]; total: number } | undefined;

  const totalLeads = leadsData?.total || 0;
  const totalProperties = propertiesList?.length || 0;
  const totalProjects = projectsList?.length || 0;
  const totalContacts = contactsData && 'total' in contactsData ? (contactsData.total as number) : 0;

  // Sort recent leads by createdAt descending
  const recentLeads = useMemo(() => {
    if (!leadsData?.leads) return [];
    return [...leadsData.leads]
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      .slice(0, 5);
  }, [leadsData?.leads]);

  // Aggregate leads by status
  const leadsByStatus = useMemo(() => {
    if (!leadsData?.leads) return [];
    
    const counts: Record<string, number> = {};
    leadsData.leads.forEach(lead => {
      const status = lead.status || 'New';
      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // sort by highest
  }, [leadsData?.leads]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 min-h-full items-center justify-center bg-[#f8fafc] dark:bg-zinc-950/20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-muted-foreground text-sm mt-4">Loading dashboard...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Contacted': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Qualified': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Site Visit': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Negotiation': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Converted': return 'bg-green-100 text-green-700 border-green-200';
      case 'Lost': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full bg-[#f8fafc] dark:bg-zinc-950/20">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/25">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none">
          <LayoutDashboard className="h-64 w-64" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-sm">
            ✨ Control Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Real-E-State <span className="text-blue-500">CRM</span></h2>
          <p className="text-indigo-200/80 text-sm leading-relaxed">
            Welcome back! Here is a live summary of your active leads, contacts, properties, and projects. Use the buttons on the right to quickly add new records.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:mt-0">
          <Button
            size="sm"
            variant="outline"
            className="h-9 gap-1.5 border-indigo-500/30 bg-white/5 hover:bg-white/10 text-white cursor-pointer"
            onClick={() => navigate("/properties")}
          >
            <Building2 className="h-4 w-4 text-indigo-300" />
            <span className="text-white hover:text-indigo-300">
              Properties
            </span>
          </Button>
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-lg shadow-indigo-600/25"
            onClick={() => navigate("/leads")}
          >
            <Plus className="h-4 w-4" />
            New Lead
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Leads */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Total Leads</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mt-4 text-slate-800 dark:text-zinc-100">
              {totalLeads}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs">
            <span className="text-slate-400 dark:text-zinc-500">Pipeline opportunities</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline" onClick={() => navigate('/leads')}>View Leads</span>
          </div>
        </div>

        {/* Total Contacts */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Total Contacts</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mt-4 text-slate-800 dark:text-zinc-100">
              {totalContacts}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs">
            <span className="text-slate-400 dark:text-zinc-500">Active CRM contacts</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-medium cursor-pointer hover:underline" onClick={() => navigate('/contacts')}>View Contacts</span>
          </div>
        </div>

        {/* Total Properties */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Properties</span>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mt-4 text-slate-800 dark:text-zinc-100">
              {totalProperties}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs">
            <span className="text-slate-400 dark:text-zinc-500">Cataloged inventory</span>
            <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline" onClick={() => navigate('/properties')}>View Properties</span>
          </div>
        </div>

        {/* Total Projects */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Projects</span>
              <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mt-4 text-slate-800 dark:text-zinc-100">
              {totalProjects}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center text-xs">
            <span className="text-slate-400 dark:text-zinc-500">Ongoing developments</span>
            <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-medium cursor-pointer hover:underline" onClick={() => navigate('/projects')}>View Projects</span>
          </div>
        </div>

      </div>

      {/* Analytics & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leads by Status Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col gap-1 mb-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-zinc-100">Leads by Status</h2>
            <p className="text-xs text-slate-400 dark:text-zinc-500">Current distribution of leads in your pipeline.</p>
          </div>
          
          {leadsByStatus.length > 0 ? (
            <div className="h-70 w-full flex flex-col items-center justify-center">
              <div className="h-45 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                    >
                      {leadsByStatus.map((_entry, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: unknown) => [value as number, "Leads"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 max-h-20 overflow-y-auto w-full text-xs">
                {leadsByStatus.map((stat, index: number) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-slate-500 dark:text-zinc-400 truncate" title={stat.name}>{stat.name}</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-70 w-full flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 border border-dashed rounded-2xl border-slate-200 dark:border-zinc-800">
              <Activity className="h-8 w-8 text-indigo-200 mb-2" />
              <p className="text-sm font-medium">No leads registered yet.</p>
            </div>
          )}
        </div>

        {/* Recent Leads Table */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-zinc-100">Recent Leads</h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500">The newest leads added to the system.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/leads")} className="cursor-pointer gap-1 border-slate-200 text-slate-600 hover:text-slate-800">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="overflow-x-auto flex-1 p-0 m-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-zinc-800/20 border-b border-slate-100 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  <th className="p-4">Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
                {recentLeads.length > 0 ? (
                  recentLeads.map((lead: Lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/10 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-slate-800 dark:text-zinc-200 block cursor-pointer hover:underline hover:text-indigo-600" onClick={() => navigate(`/leads/${lead._id}`)}>
                          {lead.firstName} {lead.lastName || ''}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-zinc-400 font-medium">
                        {lead.phone}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(lead.status || 'New')}`}>
                          {lead.status || 'New'}
                        </span>
                      </td>
                      <td className="p-4 text-right text-slate-400 dark:text-zinc-500 whitespace-nowrap">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        }) : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      No recent leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
