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
