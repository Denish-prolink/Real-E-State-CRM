import React from 'react';
import { useDeals } from '../../hooks/useDeals';

export const DealsPage: React.FC = () => {
  const { data: deals, isLoading, isError } = useDeals();

  if (isLoading) return <div className="p-6">Loading deals pipeline...</div>;
  if (isError) return <div className="p-6 text-red-500">Error loading deals.</div>;

  const stages = ['New', 'Qualified', 'Site Visit', 'Negotiation', 'Booking', 'Won', 'Lost'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sales Deals Pipeline</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Create New Deal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = deals?.filter((d: any) => d.stage === stage) || [];
          return (
            <div key={stage} className="bg-gray-50 p-3 rounded-lg border min-w-[200px]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-sm text-gray-700">{stage}</h3>
                <span className="text-xs font-bold px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                  {stageDeals.length}
                </span>
              </div>
              <div className="space-y-3">
                {stageDeals.map((deal: any) => (
                  <div key={deal._id} className="bg-white p-3 rounded shadow-sm border border-gray-100 hover:shadow transition">
                    <p className="font-bold text-sm text-gray-900">{deal.dealNumber || 'DEAL'}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Lead: {deal.leadId?.firstName} {deal.leadId?.lastName}
                    </p>
                    <p className="text-sm font-extrabold text-blue-600 mt-2">
                      ₹{deal.dealValue?.toLocaleString()}
                    </p>
                  </div>
                ))}
                {stageDeals.length === 0 && (
                  <p className="text-xs text-gray-400 italic text-center py-4">Empty</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DealsPage;
