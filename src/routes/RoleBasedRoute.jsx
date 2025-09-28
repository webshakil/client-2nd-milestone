import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AccessDenied from '../components/AccessDenied';
/*eslint-disable*/
const RoleBasedRoute = ({ children, allowedRoles = [], requiredPermissions = [] }) => {
  const { getUserRole, hasPermission, isAdmin } = useAuth();
  
  const currentRole = getUserRole().toLowerCase();
  const userIsAdmin = isAdmin();
  console.log("userIsAdmin=====>", userIsAdmin)
  
  // TEMPORARY: Bypass all role and permission checks for demo
  // Comment out the access checks
  /*
  // Check role-based access
  const hasRoleAccess = allowedRoles.length === 0 || 
    allowedRoles.map(role => role.toLowerCase()).includes(currentRole) ||
    userIsAdmin; // Super admins bypass role restrictions
  
  // Check permission-based access
  const hasPermissionAccess = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => hasPermission(permission));
  
  if (!hasRoleAccess || !hasPermissionAccess) {
    return <AccessDenied 
      requiredRoles={allowedRoles}
      requiredPermissions={requiredPermissions}
      currentRole={currentRole}
    />;
  }
  */
  
  return children;
};

export default RoleBasedRoute;
// //this code is working perfectly but to bypass roel i am writting above code
// import React from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import AccessDenied from '../components/AccessDenied';

// const RoleBasedRoute = ({ children, allowedRoles = [], requiredPermissions = [] }) => {
//   const { getUserRole, hasPermission, isAdmin } = useAuth();
  
//   const currentRole = getUserRole().toLowerCase();
//   const userIsAdmin = isAdmin();
//   console.log("userIsAdmin=====>", userIsAdmin)
  
//   // Check role-based access
//   const hasRoleAccess = allowedRoles.length === 0 || 
//     allowedRoles.map(role => role.toLowerCase()).includes(currentRole) ||
//     userIsAdmin; // Super admins bypass role restrictions
  
//   // Check permission-based access
//   const hasPermissionAccess = requiredPermissions.length === 0 || 
//     requiredPermissions.every(permission => hasPermission(permission));
  
//   if (!hasRoleAccess || !hasPermissionAccess) {
//     return <AccessDenied 
//       requiredRoles={allowedRoles}
//       requiredPermissions={requiredPermissions}
//       currentRole={currentRole}
//     />;
//   }
  
//   return children;
// };

// export default RoleBasedRoute;