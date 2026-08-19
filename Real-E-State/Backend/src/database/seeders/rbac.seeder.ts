import mongoose from 'mongoose';
import { Role } from '../../modules/roles/role.model';
import { Permission } from '../../modules/permissions/permission.model';
import logger from '../../config/logger';

const rbacTable = {
  Dashboard: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Manage', Agent: 'Own', User: 'Own' },
  Users: { 'Super Admin': 'Full', Staff: 'View', Agency: 'None', Agent: 'None', User: 'None' },
  'Roles & Permissions': { 'Super Admin': 'Full', Staff: 'None', Agency: 'None', Agent: 'None', User: 'None' },
  Agencies: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'None', Agent: 'View', User: 'None' },
  Agents: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own', Agent: 'View', User: 'None' },
  Leads: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Own', User: 'Own' },
  Buyers: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Own', User: 'Own' },
  Sellers: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Own', User: 'None' },
  Properties: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Assigned', User: 'View' },
  Projects: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'View', User: 'View' },
  'Property Units': { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Assigned', User: 'View' },
  'Site Visits': { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Own', User: 'Own' },
  'Follow-ups': { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Own', User: 'Own' },
  Calls: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Own', User: 'None' },
  WhatsApp: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Own', User: 'None' },
  Email: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Own', User: 'None' },
  Deals: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Own', User: 'View' },
  Bookings: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Own', User: 'Own' },
  Payments: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'View', User: 'Own' },
  Installments: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'View', User: 'Own' },
  Documents: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Own', User: 'Own' },

  Reports: { 'Super Admin': 'Full', Staff: 'Manage', Agency: 'Own Agency', Agent: 'Own', User: 'Own' },
  'Audit Logs': { 'Super Admin': 'Full', Staff: 'View', Agency: 'None', Agent: 'None', User: 'None' },
  Settings: { 'Super Admin': 'Full', Staff: 'None', Agency: 'Own Agency', Agent: 'Own Profile', User: 'Own Profile' },
  Profile: { 'Super Admin': 'Full', Staff: 'Full', Agency: 'Full', Agent: 'Full', User: 'Full' }
};

const mapRoleKey = (roleStr: string) => {
  switch(roleStr) {
    case 'Super Admin': return 'super_admin';
    case 'Staff': return 'staff';
    case 'Agency': return 'agency';
    case 'Agent': return 'agent';
    case 'User': return 'user';
    default: return roleStr.toLowerCase();
  }
}

const mapModuleKey = (moduleStr: string) => moduleStr.toLowerCase().replace(/ /g, '_').replace(/&/g, 'and');

export const seedRBAC = async () => {
  try {
    logger.info('Starting RBAC seeder...');

    await Permission.deleteMany({});
    await Role.deleteMany({ name: { $in: ['super_admin', 'staff', 'agency', 'agent', 'user'] } });

    const rolePermsMap: Record<string, any[]> = {
      super_admin: [],
      staff: [],
      agency: [],
      agent: [],
      user: []
    };

    const modules = Object.keys(rbacTable);

    for (const moduleName of modules) {
      const modKey = mapModuleKey(moduleName);
      // @ts-ignore
      const rolesConfig = rbacTable[moduleName];

      for (const [roleName, level] of Object.entries(rolesConfig)) {
        if (level === 'None') continue;

        const rKey = mapRoleKey(roleName);
        const permKey = `${modKey}:${(level as string).toLowerCase().replace(/ /g, '_')}`;

        let permission = await Permission.findOne({ key: permKey });
        if (!permission) {
          permission = await Permission.create({
            name: `${moduleName} - ${level}`,
            key: permKey,
            module: modKey,
            description: `Allows ${level} access to ${moduleName}`
          });
        }

        rolePermsMap[rKey].push(permission._id);
      }
    }

    for (const [rKey, permIds] of Object.entries(rolePermsMap)) {
      await Role.create({
        name: rKey,
        description: `Standard ${rKey} role`,
        permissions: permIds
      });
    }

    logger.info('RBAC Seeding completed successfully');
  } catch (error) {
    logger.error('RBAC Seeding failed', error);
  }
};
