export enum userRole {
  FREELANCER,
  ADMIN,
  CLIENT,
}

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  role: userRole;
}
