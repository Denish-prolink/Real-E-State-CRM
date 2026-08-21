import { DocumentModel } from './document.model';
import type { IDocument } from './document.types';

export const createDocument = async (data: Partial<IDocument>) => {
  return DocumentModel.create(data);
};

const buildFilter = (
  agencyId: string,
  search?: string,
  relatedType?: string,
  relatedId?: string,
) => {
  const filter: any = { agencyId };
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

export const findDocumentsByAgency = async (
  agencyId: string,
  page: number | undefined,
  perPage: number | undefined,
  search?: string,
  relatedType?: string,
  relatedId?: string,
) => {
  const filter = buildFilter(agencyId, search, relatedType, relatedId);
  const query = DocumentModel.find(filter)
    .populate('uploadedBy', 'firstName lastName email')
    .sort({ createdAt: -1 });

  if (page === undefined || perPage === undefined) {
    return query;
  }

  const skip = (page - 1) * perPage;
  return query.skip(skip).limit(perPage);
};

export const countDocumentsByAgency = async (
  agencyId: string,
  search?: string,
  relatedType?: string,
  relatedId?: string,
) => {
  return DocumentModel.countDocuments(buildFilter(agencyId, search, relatedType, relatedId));
};

export const findDocumentById = async (id: string, agencyId: string) => {
  return DocumentModel.findOne({ _id: id, agencyId }).populate(
    'uploadedBy',
    'firstName lastName email',
  );
};

export const updateDocumentById = async (
  id: string,
  agencyId: string,
  data: Partial<IDocument>,
) => {
  return DocumentModel.findOneAndUpdate({ _id: id, agencyId }, data, { new: true });
};

export const deleteDocumentById = async (id: string, agencyId: string) => {
  return DocumentModel.findOneAndDelete({ _id: id, agencyId });
};
