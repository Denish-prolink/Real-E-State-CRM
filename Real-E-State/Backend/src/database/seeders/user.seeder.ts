import bcrypt from 'bcrypt';
import { User } from '../../modules/auth/auth.model';
import logger from '../../config/logger';

export const seedUsers = async (companies: any[]) => {
  logger.info('Seeding Users...');
  await User.deleteMany({});
  const hashedPassword = await bcrypt.hash('password123', 10);
  const company1 = companies[0];
  const company2 = companies[1];

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
      lastName: 'Agency',
      email: 'agency@acme.com',
      password: hashedPassword,
      role: 'agency',
      agencyId: company1._id,
    },
    {
      firstName: 'Acme',
      lastName: 'Staff',
      email: 'staff@acme.com',
      password: hashedPassword,
      role: 'staff',
      agencyId: company1._id,
    },
    {
      firstName: 'Acme',
      lastName: 'Agent',
      email: 'agent@acme.com',
      password: hashedPassword,
      role: 'agent',
      agencyId: company1._id,
    },
    {
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@acme.com',
      password: hashedPassword,
      role: 'user',
      agencyId: company1._id,
    },
    {
      firstName: 'Stark',
      lastName: 'Agency',
      email: 'agency@stark.com',
      password: hashedPassword,
      role: 'agency',
      agencyId: company2._id,
    },
  ]);

  return users;
};
