import React from 'react';
import { Table } from '@/components/ui/table';
import type { Seller } from '../types/seller.types';

const SellerGrid: React.FC<{ sellers: Seller[]; onEdit: (s: Seller) => void; onDelete: (id: string) => void }>= ({ sellers, onEdit, onDelete }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Contact</th>
          <th>Notes</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sellers.map(s => (
          <tr key={s._id}>
            <td>{s.contactId ?? s._id}</td>
            <td>{s.notes}</td>
            <td>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}</td>
            <td>
              <button onClick={() => onEdit(s)}>Edit</button>
              <button onClick={() => onDelete(s._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default SellerGrid;
