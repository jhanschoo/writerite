import { FC } from 'react';
import { RoomBySlugDocument } from '@generated/graphql';
import { useQuery } from 'urql';
import {
  ActionIcon,
  Box,
  createStyles,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { ManageRoomMessages } from './ManageRoomMessages';
import { ManageRoomPrimaryInput } from './ManageRoomPrimaryInput';
import { ManageRoomContextual } from './ManageRoomContextual';

const useStyles = createStyles((theme) => {
  const { background: backgroundColor } = theme.fn.variant({ variant: 'default', color: 'gray' });
  // https://github.com/mantinedev/mantine/blob/c7d080c2133b0196e3a8382ec6134838632c8f9a/src/mantine-core/src/Tabs/Tab/Tab.styles.ts#L49
  const borderColor = theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3];
  return {
    gridTemplate: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gridTemplateRows: 'min-content 1fr min-content',
      maxWidth: `${theme.breakpoints.lg}px`,
      alignContent: 'end',
      margin: 'auto',
      height: '100%',
    },
    headerPanel: {
      width: '100%',
      gridArea: '1 / 1 / 2 / 3',
    },
    contextualPanel: {
      gridArea: '2 / 1 / 3 / 2',
    },
    chatPanel: {
      gridArea: '2 / 2 / 3 / 3',
      overflow: 'hidden',
    },
    inputPanel: {
      width: '100%',
      gridArea: '3 / 1 / 4 / 3',
    },
  };
});

interface Props {
  slug: string;
}

export const ManageRoom: FC<Props> = ({ slug }) => {
  const { classes } = useStyles();
  const [{ data }, refetchRoom] = useQuery({
    query: RoomBySlugDocument,
    variables: {
      slug,
    },
  });
  const room = data?.roomBySlug;
  return (
    <Box className={classes.gridTemplate}>
      <Box className={classes.headerPanel}>
        {room && <Title>Room {room.slug || room.id}</Title>}
      </Box>
      <Box className={classes.chatPanel}>
        <ManageRoomMessages room={room} />
      </Box>
      <Box className={classes.contextualPanel}>
        <ManageRoomContextual room={room} />
      </Box>
      <Box className={classes.inputPanel}>
        <ManageRoomPrimaryInput room={room} />
      </Box>
    </Box>
  );
};
