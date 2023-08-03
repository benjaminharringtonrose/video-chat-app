import { FC } from "react";
import FriendRequestCard from "../FriendRequestCard";
import FriendCard from "../FriendCard";
import SearchResultCard from "../SearchResultCard";
import InvitationCard from "../InvitationCard";

export enum ListItemType {
  Results = "Results",
  Friends = "Friends",
  User = "User",
  FriendRequest = "FriendRequest",
  Invitation = "Invitation",
}

interface IProps {
  type: ListItemType;
  username?: string;
  label?: string;
  isFriend?: boolean;
  onPress: () => void;
  viewed?: boolean;
  calling?: boolean;
  callEnded?: boolean;
  callAnswered?: boolean;
}

const ListItem: FC<IProps> = ({
  type,
  username,
  label,
  isFriend,
  onPress,
  viewed,
  calling,
  callEnded,
  callAnswered,
}) => {
  switch (type) {
    case ListItemType.Friends:
      return <FriendCard label={label} onPress={onPress} />;
    case ListItemType.Results:
      return <SearchResultCard username={username} onPress={onPress} />;
    case ListItemType.FriendRequest:
      return (
        <FriendRequestCard
          username={username}
          label={label}
          viewed={!!viewed}
          isFriend={!!isFriend}
          onPress={onPress}
        />
      );
    case ListItemType.Invitation:
    default:
      return (
        <InvitationCard
          username={username}
          label={label}
          onPress={onPress}
          viewed={!!viewed}
          calling={!!calling}
          callEnded={!!callEnded}
          callAnswered={!!callAnswered}
        />
      );
  }
};

export default ListItem;
