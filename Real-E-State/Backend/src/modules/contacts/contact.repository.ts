import { Contact, type IContact } from './contact.model';

export const createContact = async (
  data: Partial<IContact> & { agencyId: string },
): Promise<IContact> => {
  const contact = new Contact(data);
  return await contact.save();
};

const buildFilter = (agencyId: string, search?: string) => {
  return search
    ? {
        agencyId,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobileNo: { $regex: search, $options: 'i' } },
        ],
      }
    : { agencyId };
};

export const getContacts = async (
  agencyId: string,
  page: number | undefined,
  perPage: number | undefined,
  search?: string,
): Promise<IContact[]> => {
  const filter = buildFilter(agencyId, search);
  if (page === undefined || perPage === undefined) {
    return await Contact.find(filter).sort({ createdAt: -1 });
  }
  const skip = (page - 1) * perPage;
  return await Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage);
};

export const countContacts = async (agencyId: string, search?: string): Promise<number> => {
  return await Contact.countDocuments(buildFilter(agencyId, search));
};

export const getContactById = async (id: string, agencyId: string): Promise<IContact | null> => {
  return await Contact.findOne({ _id: id, agencyId });
};

export const updateContact = async (
  id: string,
  data: Partial<IContact>,
  agencyId: string,
): Promise<IContact | null> => {
  return await Contact.findOneAndUpdate({ _id: id, agencyId }, data, { new: true });
};

export const deleteContact = async (id: string, agencyId: string): Promise<IContact | null> => {
  return await Contact.findOneAndDelete({ _id: id, agencyId });
};
