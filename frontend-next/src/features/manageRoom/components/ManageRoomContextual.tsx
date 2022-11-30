import { FC } from 'react';
import { RoomDetailFragment } from '@generated/graphql';
import { FineRoomState, getFineRoomState } from '../util';
import { ManageRoomAddOccupants } from './ManageRoomAddOccupants';
import { ManageRoomSetDeck } from './ManageRoomSetDeck';

interface Props {
  room?: RoomDetailFragment;
}

export const ManageRoomContextual: FC<Props> = ({ room }) => {
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
