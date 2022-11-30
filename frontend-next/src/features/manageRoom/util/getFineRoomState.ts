import { RoomDetailFragment } from '@generated/graphql';

interface Props {
  room: RoomDetailFragment;
}

export enum FineRoomState {
  SetDeck,
  AddOccupants,
}

export function getFineRoomState({ room }: Props): FineRoomState {
  return FineRoomState.SetDeck;
}
