import { PERMISSIONS } from '../../common/constants/permissions.constant';
import logger from '../../config/logger';

export const seedPermissions = async () => {
  logger.info('Seeding Permissions...');
  // Permissions are currently static keys and not persisted to DB.
  return PERMISSIONS;
};
