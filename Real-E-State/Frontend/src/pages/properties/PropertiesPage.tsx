import React from 'react';
import { useProperties } from '../../hooks/useProperties';

export const PropertiesPage: React.FC = () => {
  const { data: properties, isLoading, isError } = useProperties();

  if (isLoading) return <div className="p-6">Loading properties...</div>;
  if (isError) return <div className="p-6 text-red-500">Error loading properties.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Property Inventory</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Add New Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties && properties.length > 0 ? (
          properties.map((prop: any) => (
            <div key={prop._id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow transition">
              <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400 font-semibold">
                {prop.propertyType} Photo
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900">{prop.title}</h3>
                  <span className="px-2 py-1 text-xs rounded font-semibold bg-green-100 text-green-800">
                    {prop.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{prop.purpose} • {prop.area} sq.ft</p>
                <div className="text-xl font-extrabold text-blue-600">
                  ₹{prop.price?.toLocaleString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white border rounded-lg">
            No properties in inventory. Click "+ Add New Property" to add units.
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
