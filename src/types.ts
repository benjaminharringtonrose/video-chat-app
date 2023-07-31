export interface IUser {
  uid: string;
  username?: string;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  createdAt?: string;
  lastLoginAt?: string;
  friends?: string[];
}

export enum NotificationType {
  FriendRequest = "FriendRequest",
}

export interface INotification {
  senderId: string;
  senderUsername: string;
  recieverId: string;
  type: NotificationType;
}

export enum ERequirement {
  Length = "length",
  Lowercase = "lowercase",
  Uppercase = "uppercase",
  Numbers = "numbers",
  Symbols = "symbols",
}

export type TRequirements = Record<ERequirement, boolean | number>;

export type ValidRequirements = Record<
  | ERequirement.Lowercase
  | ERequirement.Uppercase
  | ERequirement.Numbers
  | ERequirement.Symbols,
  boolean
>;
