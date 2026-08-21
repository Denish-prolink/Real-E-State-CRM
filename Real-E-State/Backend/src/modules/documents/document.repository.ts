import { DocumentModel } from './document.model';
import type { IDocument } from './document.types';

export const createDocument = async (data: Partial<IDocument>) => {
  return DocumentModel.create(data);
};

const buildFilter = (
  companyId: string,
  search?: string,
  relatedType?: string,
  relatedId?: string,
) => {
  const filter: any = { companyId };
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (relatedType) {
    filter.relatedType = relatedType;
  }
  if (relatedId) {
    filter.relatedId = relatedId;
  }
  return filter;
};

export const findDocumentsByCompany = async (
  companyId: string,
  page: number | undefined,
  perPage: number | undefined,
  search?: string,
  relatedType?: string,
  relatedId?: string,
) => {
  const filter = buildFilter(companyId, search, relatedType, relatedId);
  const query = DocumentModel.find(filter)
    .populate('uploadedBy', 'firstName lastName email')
    .sort({ createdAt: -1 });

  if (page === undefined || perPage === undefined) {
    return query;
  }

  const skip = (page - 1) * perPage;
  return query.skip(skip).limit(perPage);
};

export const countDocumentsByCompany = async (
  companyId: string,
  search?: string,
  relatedType?: string,
  relatedId?: string,
) => {
  return DocumentModel.countDocuments(buildFilter(companyId, search, relatedType, relatedId));
};

export const findDocumentById = async (id: string, companyId: string) => {
  return DocumentModel.findOne({ _id: id, companyId }).populate(
    'uploadedBy',
    'firstName lastName email',
  );
};

export const updateDocumentById = async (
  id: string,
  companyId: string,
  data: Partial<IDocument>,
) => {
  return DocumentModel.findOneAndUpdate({ _id: id, companyId }, data, { new: true });
};

export const deleteDocumentById = async (id: string, companyId: string) => {
  return DocumentModel.findOneAndDelete({ _id: id, companyId });
};
