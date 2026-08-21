import bcrypt from 'bcrypt';

import logger from '../../config/logger';
import { User } from '../../modules/auth/auth.model';

export const seedUsers = async (agencies: any[]) => {
  logger.info('Seeding Users...');
  await User.deleteMany({});
  const hashedPassword = await bcrypt.hash('password123', 10);
  const agency1 = agencies[0];
  const agency2 = agencies[1];

  const users = await User.create([
    {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 'super_admin',
    },
    {
      firstName: 'Acme',
      lastName: 'Admin',
      email: 'admin@acme.com',
      password: hashedPassword,
      role: 'agency',
      agencyId: agency1._id,
    },
    {
      firstName: 'Stark',
      lastName: 'Admin',
      email: 'admin@stark.com',
      password: hashedPassword,
      role: 'agency',
      agencyId: agency2._id,
    },
  ]);

  return users;
};
