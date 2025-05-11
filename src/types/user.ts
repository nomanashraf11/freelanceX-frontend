export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN'
}

export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
   role: 'CLIENT' | 'FREELANCER' | 'ADMIN'
}
