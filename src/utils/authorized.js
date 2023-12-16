export const authorized = (userRole, ...allowedRoles) =>
  allowedRoles.includes(userRole);
