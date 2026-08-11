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
      lastName: 'Admin',
      email: 'admin@acme.com',
      password: hashedPassword,
      role: 'company',
      companyId: company1._id,
    },
    {
      firstName: 'Stark',
      lastName: 'Admin',
      email: 'admin@stark.com',
      password: hashedPassword,
      role: 'company',
      companyId: company2._id,
    },
  ]);

  return users;
};
