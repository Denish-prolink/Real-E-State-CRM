import React, { useState } from 'react';
import SellerGrid from '../components/SellerGrid';
import { useGetSellers } from '../hooks/useGetSellers';
import { useDeleteSeller } from '../hooks/useDeleteSeller';

const SellersPage: React.FC = () => {
  const [page] = useState(1);
  const { data, isLoading } = useGetSellers({ page, perPage: 20 });
  const deleteMutation = useDeleteSeller();
  const onDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div>
      <h2>Sellers</h2>
      {isLoading && <div>Loading...</div>}
      {data?.data?.sellers && (
        <SellerGrid sellers={data.data.sellers} onEdit={() => {}} onDelete={onDelete} />
      )}
    </div>
  );
};

export default SellersPage;
