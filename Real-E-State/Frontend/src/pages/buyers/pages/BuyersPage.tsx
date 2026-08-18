import React, { useState } from 'react';
import BuyerGrid from '../components/BuyerGrid';
import { useGetBuyers } from '../hooks/useGetBuyers';
import { useDeleteBuyer } from '../hooks/useDeleteBuyer';

const BuyersPage: React.FC = () => {
  const [page] = useState(1);
  const { data, isLoading } = useGetBuyers({ page, perPage: 20 });
  const deleteMutation = useDeleteBuyer();
  const onDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div>
      <h2>Buyers</h2>
      {isLoading && <div>Loading...</div>}
      {data?.data?.buyers && (
        <BuyerGrid buyers={data.data.buyers} onEdit={() => {}} onDelete={onDelete} />
      )}
    </div>
  );
};

export default BuyersPage;
