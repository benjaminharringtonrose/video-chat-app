import { IUser } from "../types";

export * from "./deviceStorage";

export const isFriend = (uid: string, friends: IUser[]) => {
  let _isFriend = false;
  friends.forEach((friend) => {
    if (friend.uid === uid) {
      _isFriend = true;
    }
  });
  return _isFriend;
};
