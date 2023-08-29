import { useState } from 'react';
import { useRouter } from 'next/router';
import { FRIENDS_PATH } from '@/paths';
import { graphql } from '@generated/gql';
import { Box, Button, Title, createStyles } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useQuery } from 'urql';

import { ManageFriendRoomContextualState } from '../constants';
import { ManageFriendRoomContextual } from './ManageFriendRoomContextual';
import { ManageFriendRoomMessages } from './ManageFriendRoomMessages';
import { ManageRoomPrimaryInput } from './ManageFriendRoomPrimaryInput';

const useStyles = createStyles((theme) =>
  // https://github.com/mantinedev/mantine/blob/c7d080c2133b0196e3a8382ec6134838632c8f9a/src/mantine-core/src/Tabs/Tab/Tab.styles.ts#L49
  // const borderColor = theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3];
  ({
    gridTemplate: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gridTemplateRows: 'min-content 1fr min-content',
      maxWidth: theme.breakpoints.lg,
      alignContent: 'end',
      margin: 'auto',
      height: '100%',
    },
    headerPanel: {
      width: '100%',
      gridArea: '1 / 1 / 2 / 3',
    },
    contextualPanel: {
      gridArea: '2 / 2 / 4 / 3',
    },
    chatPanel: {
      gridArea: '2 / 1 / 3 / 2',
      overflow: 'hidden',
    },
    inputPanel: {
      width: '100%',
      gridArea: '3 / 1 / 4 / 2',
    },
  })
);

const ManageFriendRoomFriendQuery = graphql(/* GraphQL */ `
  query ManageFriendRoomFriendQuery($id: ID!) {
    friend(id: $id) {
      id
      name
      bio
    }
  }
`);

const ManageFriendRoomQuery = graphql(/* GraphQL */ `
  query ManageFriendRoomQuery($otherOccupantIds: [ID!]!) {
    persistentRoomByOccupants(otherOccupantIds: $otherOccupantIds) {
      id
      ...ManageRoomContextual
    }
  }
`);

interface Props {
  id: string;
}

export const ManageFriendRoom = ({ id }: Props) => {
  const { classes } = useStyles();
  const router = useRouter();
  const [{ data: friendData }] = useQuery({
    query: ManageFriendRoomFriendQuery,
    variables: { id },
  });
  const [{ data }] = useQuery({
    query: ManageFriendRoomQuery,
    variables: { otherOccupantIds: [id] },
  });
  const [contextualState] = useState<ManageFriendRoomContextualState>(
    ManageFriendRoomContextualState.Dummy
  );

  const room = data?.persistentRoomByOccupants;
  return (
    <Box className={classes.gridTemplate}>
      <Box
        className={classes.headerPanel}
        sx={({ spacing }) => ({
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
        })}
      >
        <Button
          variant="outline"
          onClick={() => router.push(FRIENDS_PATH)}
          leftIcon={<IconArrowLeft />}
        >
          Back
        </Button>
        {(room && friendData?.friend && (
          <Title>Chat with {friendData.friend.name}</Title>
        )) ??
          undefined}
      </Box>
      <Box className={classes.chatPanel}>
        {room && <ManageFriendRoomMessages roomId={room?.id} />}
      </Box>
      {room && (
        <Box className={classes.contextualPanel}>
          <ManageFriendRoomContextual state={contextualState} />
        </Box>
      )}
      <Box className={classes.inputPanel}>
        {room && <ManageRoomPrimaryInput roomId={room?.id} />}
      </Box>
    </Box>
  );
};
