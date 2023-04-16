import { useMutation } from 'urql';
import { Divider, Text, Title } from '@mantine/core';
import { SearchDecks } from '@/features/manageDecks';
import { graphql } from '@generated/gql';

const RoomSetDeckMutation = graphql(/* GraphQL */ `
  mutation ManageRoomRoomSetDeck(
    $deckId: ID!
    $id: ID!
  ) {
    roomSetDeck(deckId: $deckId, id: $id) {
      id
      activeRound {
        id
        deck {
          id
          name
        }
        slug
      }
    }
  }
`);

interface Props {
  roomId: string;
}

export const ManageRoomSetDeck = ({ roomId }: Props) => {
  const [, roomSetDeckMutation] = useMutation(RoomSetDeckMutation);
  return (
    <>
      <Title order={2} size="h5" align="center">
        Please choose a deck to serve in this room
      </Title>
      <SearchDecks
        onClickFactory={(deckId) =>
          (e) => {
            e.stopPropagation();
            roomSetDeckMutation({ deckId, id: roomId });
          }}
      />
      <Divider />
    </>
  );
};
