import { FC } from "react";
import FriendRequestCard from "../FriendRequestCard";
import FriendCard from "../FriendCard";
import SearchResultCard from "../SearchResultCard";
import InvitationCard from "../InvitationCard";
import { CardType } from "../../types";
import MessageThreadCard from "../MessageThreadCard";

interface IProps {
  type: CardType;
  username?: string;
  label?: string;
  isFriend?: boolean;
  onPress: () => void;
  viewed?: boolean;
  isOnline?: boolean;
  avatar?: string;
  lastMessage?: string;
  unreadCount?: number;
  updatedAt?: string;
}

const Card: FC<IProps> = ({
  type,
  username,
  label,
  isFriend,
  onPress,
  viewed,
  isOnline,
  avatar,
  lastMessage,
  unreadCount,
  updatedAt,
}) => {
  switch (type) {
    case CardType.Friends:
      return <FriendCard label={label} onPress={onPress} isOnline={isOnline} />;
    case CardType.Results:
      return <SearchResultCard username={username} onPress={onPress} />;
    case CardType.FriendRequest:
      return (
        <FriendRequestCard
          username={username}
          label={label}
          viewed={!!viewed}
          isFriend={!!isFriend}
          onPress={onPress}
        />
      );
    case CardType.MessageThread:
      return (
        <MessageThreadCard
          username={username}
          avatar={avatar}
          lastMessage={lastMessage}
          unreadCount={unreadCount}
          updatedAt={updatedAt}
        />
      );
    default:
      return null;
  }
};

export default Card;
