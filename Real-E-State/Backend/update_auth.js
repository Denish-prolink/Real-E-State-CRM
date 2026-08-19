
const fs = require('fs');

const servicePath = 'src/modules/auth/auth.service.ts';
let content = fs.readFileSync(servicePath, 'utf8');

const importStr = \import { Role } from '../roles/role.model';
import { Permission } from '../permissions/permission.model';

export const getUserPermissions = async (roleName: string) => {
  let permissionsMap: Record<string, string> = {};
  if (roleName) {
    const roleDoc = await Role.findOne({ name: roleName }).populate('permissions').lean();
    if (roleDoc && roleDoc.permissions) {
      roleDoc.permissions.forEach((perm: any) => {
        if (perm.module && perm.key) {
          const level = perm.key.split('_').pop() || '';
          permissionsMap[perm.module.toLowerCase()] = level;
        }
      });
    }
  }
  return permissionsMap;
};
\;

if (!content.includes('import { Role }')) {
  content = content.replace(\import type { ICompany } from '../companies/company.model';\, \import type { ICompany } from '../companies/company.model';\n\\);
}

content = content.replace(/  return \{\n    accessToken,\n    refreshToken,\n    user,\n  \};/g, \
  const permissions = await getUserPermissions(user.role);
  return {
    accessToken,
    refreshToken,
    user: { ...user.toJSON(), permissions },
  };\);

content = content.replace(/  return user;\n\};/g, \
  const permissions = await getUserPermissions(user.role);
  return { ...user.toJSON(), permissions };
};\);

fs.writeFileSync(servicePath, content, 'utf8');

