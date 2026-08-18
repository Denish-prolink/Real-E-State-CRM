import React from 'react';
import { Table } from '@/components/ui/table';
import type { Buyer } from '../types/buyer.types';

const BuyerGrid: React.FC<{ buyers: Buyer[]; onEdit: (b: Buyer) => void; onDelete: (id: string) => void }>= ({ buyers, onEdit, onDelete }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name/Contact</th>
          <th>Notes</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {buyers.map(b => (
          <tr key={b._id}>
            <td>{b.contactId ?? b._id}</td>
            <td>{b.notes}</td>
            <td>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ''}</td>
            <td>
              <button onClick={() => onEdit(b)}>Edit</button>
              <button onClick={() => onDelete(b._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default BuyerGrid;
