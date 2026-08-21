import * as documentRepository from './document.repository';
import type { IDocument } from './document.types';

export const createDocumentService = async (
  agencyId: string,
  userId: string,
  data: Partial<IDocument>,
) => {
  return documentRepository.createDocument({
    ...data,
    agencyId: agencyId as any,
    uploadedBy: userId as any,
  });
};

export const getDocumentsService = async (
  agencyId: string,
  page: number | undefined,
  perPage: number | undefined,
  search?: string,
  relatedType?: string,
  relatedId?: string,
) => {
  const [documents, total] = await Promise.all([
    documentRepository.findDocumentsByAgency(
      agencyId,
      page,
      perPage,
      search,
      relatedType,
      relatedId,
    ),
    documentRepository.countDocumentsByAgency(agencyId, search, relatedType, relatedId),
  ]);

  return {
    documents,
    total,
    page,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getDocumentByIdService = async (id: string, agencyId: string) => {
  const document = await documentRepository.findDocumentById(id, agencyId);
  if (!document) {
    throw new Error('Document not found');
  }
  return document;
};

export const updateDocumentService = async (
  id: string,
  agencyId: string,
  data: Partial<IDocument>,
) => {
  const document = await documentRepository.updateDocumentById(id, agencyId, data);
  if (!document) {
    throw new Error('Document not found');
  }
  return document;
};

export const deleteDocumentService = async (id: string, agencyId: string) => {
  const document = await documentRepository.deleteDocumentById(id, agencyId);
  if (!document) {
    throw new Error('Document not found');
  }
  return document;
};
