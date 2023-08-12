import { FC } from "react";
import FriendRequestCard from "../FriendRequestCard";
import FriendCard from "../FriendCard";
import SearchResultCard from "../SearchResultCard";
import InvitationCard from "../InvitationCard";
import { CardType } from "../../types";

interface IProps {
  type: CardType;
  username?: string;
  label?: string;
  isFriend?: boolean;
  onPress: () => void;
  viewed?: boolean;
  calling?: boolean;
  callEnded?: boolean;
  callAnswered?: boolean;
  isOnline?: boolean;
}

const Card: FC<IProps> = ({
  type,
  username,
  label,
  isFriend,
  onPress,
  viewed,
  calling,
  callEnded,
  callAnswered,
  isOnline,
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
    case CardType.Invitation:
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

export default Card;
