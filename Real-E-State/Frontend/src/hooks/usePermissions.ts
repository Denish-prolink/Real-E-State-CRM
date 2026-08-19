import { useAppSelector } from '../app/hooks';

export const usePermissions = () => {
  const user = useAppSelector((state) => state.auth.user);
  
  const permissions = user?.permissions || {};
  
  const hasAccess = (moduleName: string) => {
    if (user?.role === 'super_admin') return true;
    
    // Normalize string to lowercase and remove spaces for easy lookup
    const normalizedModule = moduleName.toLowerCase().replace(/\s+/g, '');
    const level = permissions[normalizedModule] || permissions[moduleName.toLowerCase()];
    
    // If undefined or 'None'
    if (!level || level.toLowerCase() === 'none') return false;
    
    return true;
  };
  
  const getAccessLevel = (moduleName: string) => {
    if (user?.role === 'super_admin') return 'Full';
    const normalizedModule = moduleName.toLowerCase().replace(/\s+/g, '');
    return permissions[normalizedModule] || permissions[moduleName.toLowerCase()] || 'None';
  };
  
  return { hasAccess, getAccessLevel, permissions, role: user?.role };
};
