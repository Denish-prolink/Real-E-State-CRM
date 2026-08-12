import logger from '../../config/logger';
import { PERMISSIONS } from '../../common/constants/permissions.constant';

export const seedPermissions = async () => {
  logger.info('Seeding Permissions...');
  // Permissions are currently static keys and not persisted to DB.
  return PERMISSIONS;
};
