export interface IUser {
  uid: string;
  username?: string;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  createdAt?: string;
  lastLoginAt?: string;
  friends?: string[];
  invitations?: string[];
}

export enum NotificationType {
  FriendRequest = "FriendRequest",
  Invitation = "Invitation",
}

export interface INotification {
  id?: string;
  senderId?: string;
  senderUsername?: string;
  receiverId?: string;
  roomId?: string;
  type: NotificationType;
  viewed: boolean;
}

export interface IInvitation {
  senderId: string;
  senderUsername: string;
  receiverId: string;
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
