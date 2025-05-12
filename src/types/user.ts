export interface Profile {
  firstName: string;
  lastName: string;
  bio: string;
  skillVerified: boolean;
}

export interface User {
  userId: string;
  email: string;
  profile: Profile;
  role: "CLIENT" | "FREELANCER" | "ADMIN";
}

export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bio: string;
  role: "CLIENT" | "FREELANCER" | "ADMIN";
}
