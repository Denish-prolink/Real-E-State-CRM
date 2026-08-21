import bcrypt from 'bcrypt';

import logger from '../../config/logger';
import { User } from '../../modules/auth/auth.model';

export const seedUsers = async () => {
  logger.info('Seeding Users...');
  await User.deleteMany({});
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await User.create([
    {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 'super_admin',
    },
  ]);

  return users;
};
