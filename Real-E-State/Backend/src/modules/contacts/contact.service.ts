import { ApiError } from '../../common/exceptions/ApiError';

import type { IContact } from './contact.model';
import * as repository from './contact.repository';

export const createContact = async (data: Partial<IContact> & { agencyId: string }) => {
  return await repository.createContact(data);
};

export const getContacts = async (
  agencyId: string,
  page: number | undefined,
  perPage: number | undefined,
  search?: string,
) => {
  const [contacts, total] = await Promise.all([
    repository.getContacts(agencyId, page, perPage, search),
    repository.countContacts(agencyId, search),
  ]);

  return {
    contacts,
    total,
    page,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getContactById = async (id: string, agencyId: string) => {
  const contact = await repository.getContactById(id, agencyId);
  if (!contact) {
    throw new ApiError('Contact not found', 404);
  }
  return contact;
};

export const updateContact = async (id: string, data: Partial<IContact>, agencyId: string) => {
  const contact = await repository.updateContact(id, data, agencyId);
  if (!contact) {
    throw new ApiError('Contact not found', 404);
  }
  return contact;
};

export const deleteContact = async (id: string, agencyId: string) => {
  const contact = await repository.deleteContact(id, agencyId);
  if (!contact) {
    throw new ApiError('Contact not found', 404);
  }
  return contact;
};
