import React from 'react';
import { useLeads } from '../../hooks/useLeads';

export const LeadsPage: React.FC = () => {
  const { data: leads, isLoading, isError } = useLeads();

  if (isLoading) return <div className="p-6">Loading leads...</div>;
  if (isError) return <div className="p-6 text-red-500">Error loading leads.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Add New Lead
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads && leads.length > 0 ? (
              leads.map((lead: any) => (
                <tr key={lead._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {lead.firstName} {lead.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{lead.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {lead.status || 'New'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{lead.priority || 'Medium'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{lead.source || 'Website'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No leads found. Click "+ Add New Lead" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsPage;
