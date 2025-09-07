const ROLES = {
  ADMIN: "admin",
  TRAINER: "trainer",
  STUDENT: "student",
};

const roleHierarchy = {
  [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.TRAINER, ROLES.STUDENT],
  [ROLES.TRAINER]: [ROLES.TRAINER, ROLES.STUDENT],
  [ROLES.STUDENT]: [ROLES.STUDENT],
};

export const authorize = (requiredRole, userRole) => {
  if (!userRole || !requiredRole) return false;
  const userRoles = roleHierarchy[userRole];
  if (!userRoles) return false;
  return userRoles.includes(requiredRole);
};
