import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import * as service from './document.service';

export const createDocument = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const userId = req.user?.userId as string;
  const document = await service.createDocumentService(agencyId, userId, req.body);
  return successResponse(res, 'Document created successfully', document, 201);
};

export const getDocuments = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const page = req.query.page ? Math.max(1, parseInt(req.query.page as string)) : undefined;
  const perPage = req.query.perPage
    ? Math.max(1, parseInt(req.query.perPage as string))
    : undefined;
  const search = (req.query.search as string) || undefined;
  const relatedType = (req.query.relatedType as string) || undefined;
  const relatedId = (req.query.relatedId as string) || undefined;

  const documents = await service.getDocumentsService(
    agencyId,
    page,
    perPage,
    search,
    relatedType,
    relatedId,
  );
  return successResponse(res, 'Documents retrieved successfully', documents);
};

export const getDocumentById = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const document = await service.getDocumentByIdService(req.params.id as string, agencyId);
  return successResponse(res, 'Document retrieved successfully', document);
};

export const updateDocument = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const document = await service.updateDocumentService(
    req.params.id as string,
    agencyId,
    req.body,
  );
  return successResponse(res, 'Document updated successfully', document);
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  await service.deleteDocumentService(req.params.id as string, agencyId);
  return successResponse(res, 'Document deleted successfully');
};
