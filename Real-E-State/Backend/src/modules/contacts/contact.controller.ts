import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getCompanyId } from '../../middlewares/auth.middleware';

import * as service from './contact.service';

export const createContact = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const contact = await service.createContact({ ...req.body, companyId });
  return successResponse(res, 'Contact created successfully', contact, 201);
};

export const getContacts = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const page = req.query.page ? Math.max(1, parseInt(req.query.page as string)) : undefined;
  const perPage = req.query.perPage
    ? Math.max(1, parseInt(req.query.perPage as string))
    : undefined;
  const search = (req.query.search as string) || undefined;

  const contacts = await service.getContacts(companyId, page, perPage, search);
  return successResponse(res, 'Contacts retrieved successfully', contacts);
};

export const getContactById = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const contact = await service.getContactById(req.params.id as string, companyId);
  return successResponse(res, 'Contact retrieved successfully', contact);
};

export const updateContact = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const contact = await service.updateContact(req.params.id as string, req.body, companyId);
  return successResponse(res, 'Contact updated successfully', contact);
};

export const deleteContact = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  await service.deleteContact(req.params.id as string, companyId);
  return successResponse(res, 'Contact deleted successfully');
};
