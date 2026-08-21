import logger from '../../config/logger';
import { Contact } from '../../modules/contacts/contact.model';

export const seedContacts = async (agencies: any[]) => {
  logger.info('Seeding Contacts...');
  await Contact.deleteMany({});
  const agency1 = agencies[0];
  const agency2 = agencies[1];

  const contacts = await Contact.create([
    {
      name: 'John Doe',
      type: 'customer',
      email: 'john.customer@example.com',
      mobileNo: '1112223333',
      gender: 'male',
      address: '123 Customer Ave',
      agencyId: agency1._id,
    },
    {
      name: 'Jane Smith',
      type: 'supplier',
      email: 'jane.supplier@example.com',
      mobileNo: '4445556666',
      gender: 'female',
      address: '456 Supplier Blvd',
      agencyId: agency1._id,
    },
    {
      name: 'Pepper Potts',
      type: 'customer',
      email: 'pepper@stark.com',
      mobileNo: '9998887777',
      gender: 'female',
      address: '1000 Stark Way',
      agencyId: agency2._id,
    },
  ]);

  return contacts;
};
