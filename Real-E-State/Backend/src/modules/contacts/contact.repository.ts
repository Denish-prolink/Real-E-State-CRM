import { Contact, type IContact } from './contact.model';

export const createContact = async (
  data: Partial<IContact> & { companyId: string },
): Promise<IContact> => {
  const contact = new Contact(data);
  return await contact.save();
};

const buildFilter = (companyId: string, search?: string) => {
  return search
    ? {
        companyId,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobileNo: { $regex: search, $options: 'i' } },
        ],
      }
    : { companyId };
};

export const getContacts = async (
  companyId: string,
  page: number | undefined,
  perPage: number | undefined,
  search?: string,
): Promise<IContact[]> => {
  const filter = buildFilter(companyId, search);
  if (page === undefined || perPage === undefined) {
    return await Contact.find(filter).sort({ createdAt: -1 });
  }
  const skip = (page - 1) * perPage;
  return await Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(perPage);
};

export const countContacts = async (companyId: string, search?: string): Promise<number> => {
  return await Contact.countDocuments(buildFilter(companyId, search));
};

export const getContactById = async (id: string, companyId: string): Promise<IContact | null> => {
  return await Contact.findOne({ _id: id, companyId });
};

export const updateContact = async (
  id: string,
  data: Partial<IContact>,
  companyId: string,
): Promise<IContact | null> => {
  return await Contact.findOneAndUpdate({ _id: id, companyId }, data, { new: true });
};

export const deleteContact = async (id: string, companyId: string): Promise<IContact | null> => {
  return await Contact.findOneAndDelete({ _id: id, companyId });
};
