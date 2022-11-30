import { FC } from 'react';
import { RoomDetailFragment, RoomSetDeckDocument } from '@generated/graphql';
import { useMutation } from 'urql';
import { Divider, Text, Title } from '@mantine/core';
import { SearchDecks } from '@/features/manageDecks';

interface Props {
  room: RoomDetailFragment;
}

export const ManageRoomSetDeck: FC<Props> = ({ room: { id } }) => {
  const [, roomCreateMutation] = useMutation(RoomSetDeckDocument);
  return (
    <>
      <Title order={2} size="h5" align="center">
        Please choose a deck to serve in this room
      </Title>
      <SearchDecks
        onClickFactory={({ id: deckId }) =>
          (e) => {
            e.stopPropagation();
            roomCreateMutation({ deckId, id });
          }}
      />
      <Divider />
    </>
  );
};
