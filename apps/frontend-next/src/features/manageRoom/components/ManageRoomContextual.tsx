import { RoomDetailFragment } from '@generated/graphql';
import { FineRoomState, getFineRoomState } from '../util';
import { ManageRoomAddOccupants } from './ManageRoomAddOccupants';
import { ManageRoomSetDeck } from './ManageRoomSetDeck';

interface Props {
  room?: RoomDetailFragment;
}

export const ManageRoomContextual = ({ room }: Props) => {
  if (!room) {
    return null;
  }
  switch (getFineRoomState({ room })) {
    case FineRoomState.SetDeck:
      return <ManageRoomSetDeck room={room} />;
    case FineRoomState.AddOccupants:
      return <ManageRoomAddOccupants room={room} />;
  }
};
