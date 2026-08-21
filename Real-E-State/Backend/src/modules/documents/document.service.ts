import * as documentRepository from './document.repository';
import type { IDocument } from './document.types';

export const createDocumentService = async (
  companyId: string,
  userId: string,
  data: Partial<IDocument>,
) => {
  return documentRepository.createDocument({
    ...data,
    companyId: companyId as any,
    uploadedBy: userId as any,
  });
};

export const getDocumentsService = async (
  companyId: string,
  page: number | undefined,
  perPage: number | undefined,
  search?: string,
  relatedType?: string,
  relatedId?: string,
) => {
  const [documents, total] = await Promise.all([
    documentRepository.findDocumentsByCompany(
      companyId,
      page,
      perPage,
      search,
      relatedType,
      relatedId,
    ),
    documentRepository.countDocumentsByCompany(companyId, search, relatedType, relatedId),
  ]);

  return {
    documents,
    total,
    page,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getDocumentByIdService = async (id: string, companyId: string) => {
  const document = await documentRepository.findDocumentById(id, companyId);
  if (!document) {
    throw new Error('Document not found');
  }
  return document;
};

export const updateDocumentService = async (
  id: string,
  companyId: string,
  data: Partial<IDocument>,
) => {
  const document = await documentRepository.updateDocumentById(id, companyId, data);
  if (!document) {
    throw new Error('Document not found');
  }
  return document;
};

export const deleteDocumentService = async (id: string, companyId: string) => {
  const document = await documentRepository.deleteDocumentById(id, companyId);
  if (!document) {
    throw new Error('Document not found');
  }
  return document;
};
