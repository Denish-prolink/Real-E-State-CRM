import React, { useState } from 'react';
import { useDocuments, useCreateDocument, useUpdateDocument, useDeleteDocument } from '../../hooks/useDocuments';
import type { DocumentData } from '../../hooks/useDocuments';
import DocumentFormDrawer from './components/DocumentFormDrawer';
import { Pencil, Trash2 } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { data: documents, isLoading, isError } = useDocuments();
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<DocumentData | null>(null);

  const handleOpenDrawer = (doc?: DocumentData) => {
    setDocumentToEdit(doc || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setDocumentToEdit(null);
  };

  const handleSubmit = async (values: DocumentData) => {
    if (documentToEdit?._id) {
      await updateDocument.mutateAsync({ id: documentToEdit._id, documentData: values });
    } else {
      await createDocument.mutateAsync(values);
    }
    handleCloseDrawer();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      await deleteDocument.mutateAsync(id);
    }
  };

  if (isLoading) return <div className="p-6">Loading documents...</div>;
  if (isError) return <div className="p-6 text-red-500">Error loading documents.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Documents Management</h1>
        <button 
          onClick={() => handleOpenDrawer()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          + Add New Document
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Related To</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents && documents.length > 0 ? (
              documents.map((doc: any) => (
                <tr key={doc._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {doc.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      View File
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {doc.relatedType ? `${doc.relatedType}` : 'None'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleOpenDrawer(doc)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                  No documents found. Click "+ Add New Document" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DocumentFormDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
        documentToEdit={documentToEdit}
        isSubmitting={createDocument.isPending || updateDocument.isPending}
      />
    </div>
  );
};

export default DocumentsPage;
