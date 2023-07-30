export interface IUser {
  uid: string;
  username?: string;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}
