import { ApiError } from '../../common/exceptions/ApiError';

import type { IContact } from './contact.model';
import * as repository from './contact.repository';

export const createContact = async (data: Partial<IContact> & { companyId: string }) => {
  return await repository.createContact(data);
};

export const getContacts = async (
  companyId: string,
  page: number | undefined,
  perPage: number | undefined,
  search?: string,
) => {
  const [contacts, total] = await Promise.all([
    repository.getContacts(companyId, page, perPage, search),
    repository.countContacts(companyId, search),
  ]);

  return {
    contacts,
    total,
    page,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getContactById = async (id: string, companyId: string) => {
  const contact = await repository.getContactById(id, companyId);
  if (!contact) {
    throw new ApiError('Contact not found', 404);
  }
  return contact;
};

export const updateContact = async (id: string, data: Partial<IContact>, companyId: string) => {
  const contact = await repository.updateContact(id, data, companyId);
  if (!contact) {
    throw new ApiError('Contact not found', 404);
  }
  return contact;
};

export const deleteContact = async (id: string, companyId: string) => {
  const contact = await repository.deleteContact(id, companyId);
  if (!contact) {
    throw new ApiError('Contact not found', 404);
  }
  return contact;
};
