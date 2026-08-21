import { useState } from 'react';
import type { DocumentData } from '../../../hooks/useDocuments';
import { useCreateDocument, useDeleteDocument, useDocuments, useUpdateDocument } from '../../../hooks/useDocuments';
import DocumentFormDrawer from './DocumentFormDrawer';

interface EntityDocumentsProps {
  relatedType: string;
  relatedId: string;
}

export default function EntityDocuments({ relatedType, relatedId }: EntityDocumentsProps) {
  const { data: documents, isLoading, isError } = useDocuments({ relatedType, relatedId });
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

  if (isLoading) return <div className="p-4">Loading documents...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading documents.</div>;

  return (
    <div className="mt-8 border rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Documents</h3>
        <button
          onClick={() => handleOpenDrawer()}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          + Add Document
        </button>
      </div>

      <div className="p-4">
        {documents && documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc: any) => (
              <div key={doc._id} className="border rounded-md p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 truncate">{doc.title}</h4>
                  {doc.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{doc.description}</p>}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:text-indigo-900">View File</a>
                  <div className="flex space-x-2">
                    <button onClick={() => handleOpenDrawer(doc)} className="text-sm text-gray-600 hover:text-gray-900">Edit</button>
                    <button onClick={() => handleDelete(doc._id)} className="text-sm text-red-600 hover:text-red-900">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No documents found for this {relatedType.toLowerCase()}.</p>
        )}
      </div>

      <DocumentFormDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
        documentToEdit={documentToEdit}
        isSubmitting={createDocument.isPending || updateDocument.isPending}
        defaultRelatedType={relatedType}
        defaultRelatedId={relatedId}
      />
    </div>
  );
}
