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
  isOnline?: boolean;
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
  calling?: boolean;
  callAnswered?: boolean;
  callEnded?: boolean;
  createdAt?: string;
}

export interface IRoom {
  offer?: any;
  answer?: any;
  offerCandidates?: any;
  answerCandidates?: any;
  calling?: boolean;
  callAnswered?: boolean;
  callEnded?: boolean;
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

export enum QueryKey {
  ReceiverId = "receiverId",
  Type = "type",
  Uid = "uid",
  RoomId = "roomId",
}

export enum Collection {
  Notifications = "notifications",
  Users = "users",
  Rooms = "rooms",
  OfferCandidates = "offerCandidates",
  AnswerCandidates = "answerCandidates",
  Calls = "calls",
}

export enum CallMode {
  Host = "host",
  Join = "join",
}

export interface ICall {
  id: string;
  senderUsername?: string;
  senderId?: string;
  receiverId?: string;
  roomId: string;
  createdAt: string;
}
