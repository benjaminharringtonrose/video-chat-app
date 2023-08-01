import { atom, useRecoilState } from "recoil";
import { IInvitation } from "../types";

export const invitationsState = atom<IInvitation[]>({
  key: "invitationsState",
  default: [],
});

export const useInvitations = () => {
  const [state, setState] = useRecoilState(invitationsState);

  const setInvitations = (invitations: IInvitation[]) => {
    setState(invitations);
  };

  return {
    invitations: state,
    setInvitations,
  };
};
