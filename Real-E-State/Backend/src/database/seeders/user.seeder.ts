import bcrypt from 'bcrypt';

import logger from '../../config/logger';
import { User } from '../../modules/auth/auth.model';

export const seedUsers = async (companies: any[]) => {
  logger.info('Seeding Users...');
  await User.deleteMany({});
  const hashedPassword = await bcrypt.hash('123456', 10);
  const agency1 = companies[0];

  const users = await User.create([
    {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
    {
      firstName: 'CRM',
      lastName: 'Staff',
      email: 'staff@gmail.com',
      password: hashedPassword,
      role: 'STAFF',
    },
    {
      firstName: 'Real Estate',
      lastName: 'Agency',
      email: 'agency@gmail.com',
      password: hashedPassword,
      role: 'AGENCY',
      agencyId: agency1._id,
    },
    {
      firstName: 'Property',
      lastName: 'Agent',
      email: 'agent@gmail.com',
      password: hashedPassword,
      role: 'AGENT',
      agencyId: agency1._id,
    },
    {
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@gmail.com',
      password: hashedPassword,
      role: 'USER',
    },
  ]);

  return users;
};
