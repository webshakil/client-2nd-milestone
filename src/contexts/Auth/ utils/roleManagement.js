// DATABASE-DRIVEN ROLE MANAGEMENT FUNCTIONS

// Derive permissions from role based on milestone document
export const derivePermissionsFromRole = (adminRole) => {
  if (!adminRole || adminRole === 'user') return [];
  
  const rolePermissionMap = {
    // Super Admin Roles - Full privileges
    'manager': [
      'manage_users', 'manage_elections', 'view_analytics', 
      'manage_content', 'view_audit', 'manage_ads', 'super_admin',
      'manage_subscriptions', 'manage_payments', 'system_config'
    ],
    'admin': [
      'manage_users', 'manage_elections', 'view_analytics', 
      'manage_content', 'view_audit', 'manage_ads', 'super_admin',
      'manage_subscriptions', 'manage_payments'
    ],
    
    // Functional Admin Roles - Limited privileges
    'moderator': ['manage_elections', 'manage_content', 'view_analytics'],
    'auditor': ['view_audit', 'view_analytics', 'audit_elections'],
    'editor': ['manage_content', 'edit_elections'],
    'advertiser': ['manage_ads', 'view_analytics', 'campaign_management'],
    
    // Specialized Role - Data access only (NOT ADMIN)
    'analyst': ['view_analytics', 'export_data', 'generate_reports']
  };
  
  return rolePermissionMap[adminRole.toLowerCase()] || [];
};

// Dashboard redirect based on cached role data
export const getDashboardRoute = (adminRole) => {
  const role = (adminRole || 'user').toLowerCase();
  
  // Route based on milestone document hierarchy
  switch (role) {
    case 'manager':
      return '/admin/super-dashboard'; // Full system control
    case 'admin':
      return '/admin/dashboard'; // Admin dashboard
    case 'moderator':
      return '/admin/moderation'; // Content & election management
    case 'auditor':
      return '/admin/audit'; // Audit and verification tools
    case 'editor':
      return '/admin/content'; // Content editing dashboard
    case 'advertiser':
      return '/admin/campaigns'; // Campaign management
    case 'analyst':
      return '/analytics'; // Analytics dashboard (READ-ONLY)
    default:
      return '/dashboard'; // Regular user dashboard
  }
};

// Role validation functions
export const isAdmin = (adminRole) => {
  if (!adminRole) return false;
  
  // Only Manager and Admin are true admins
  const superAdminRoles = ['manager', 'admin'];
  return superAdminRoles.includes(adminRole.toLowerCase());
};

export const isSuperAdmin = (adminRole) => {
  const permissions = derivePermissionsFromRole(adminRole);
  return permissions?.includes('super_admin') || false;
};

export const canManageUsers = (adminRole) => {
  const permissions = derivePermissionsFromRole(adminRole);
  return permissions?.includes('manage_users') || false;
};

export const hasPermission = (adminRole, permission) => {
  const permissions = derivePermissionsFromRole(adminRole);
  return permissions?.includes(permission) || false;
};