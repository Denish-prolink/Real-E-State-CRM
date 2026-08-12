import logger from '../../config/logger';
import { ROLES } from '../../common/constants/roles.constant';

export const seedRoles = async () => {
  logger.info('Seeding Roles...');
  // Roles are represented as strings in the User model enum.
  // There is no dedicated Role collection, so we just ensure constants exist.
  return ROLES;
};
