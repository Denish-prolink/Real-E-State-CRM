import { Contact } from '../../modules/contacts/contact.model';
import logger from '../../config/logger';

export const seedContacts = async (companies: any[]) => {
  logger.info('Seeding Contacts...');
  await Contact.deleteMany({});
  const company1 = companies[0];
  const company2 = companies[1];

  const contacts = await Contact.create([
    {
      name: 'John Doe',
      type: 'customer',
      email: 'john.customer@example.com',
      mobileNo: '1112223333',
      gender: 'male',
      address: '123 Customer Ave',
      agencyId: company1._id,
    },
    {
      name: 'Jane Smith',
      type: 'supplier',
      email: 'jane.supplier@example.com',
      mobileNo: '4445556666',
      gender: 'female',
      address: '456 Supplier Blvd',
      agencyId: company1._id,
    },
    {
      name: 'Pepper Potts',
      type: 'customer',
      email: 'pepper@stark.com',
      mobileNo: '9998887777',
      gender: 'female',
      address: '1000 Stark Way',
      agencyId: company2._id,
    },
  ]);

  return contacts;
};
