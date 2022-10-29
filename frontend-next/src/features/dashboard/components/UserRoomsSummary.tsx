import { useRouter } from 'next/router';
import { FC, MouseEvent, MouseEventHandler } from 'react';
import { useMutation, useQuery } from 'urql';
import { useMotionContext } from '@hooks/useMotionContext';
import { motionThemes } from '@lib/framer-motion/motionThemes';
import {
  OccupyingRoomsDocument,
  OccupyingRoomsQuery,
  RoomCreateDocument,
} from '@generated/graphql';
import {
  Button,
  Card,
  createStyles,
  Divider,
  Group,
  Paper,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { RoomSummaryContent } from '@/components/room/RoomSummaryContent';
import Link from 'next/link';

export const USER_DECK_SUMMARY_DECKS_NUM = 20;

const NewRoomItem = () => {
  const router = useRouter();
  const { setMotionProps } = useMotionContext();
  const [, roomCreateMutation] = useMutation(RoomCreateDocument);
  const handleCreateRoom = async (e: MouseEvent) => {
    e.stopPropagation();
    setMotionProps(motionThemes.forward);
    const createdRoom = await roomCreateMutation({});
    if (createdRoom.data?.roomCreate) {
      router.push(
        `/app/room/${createdRoom.data.roomCreate.slug || createdRoom.data.roomCreate.id}`
      );
    }
  };

  return (
    <Button onClick={handleCreateRoom} size="md" radius="xl" mb="md">
      Start a new Room
    </Button>
  );
};

const RoomItem = ({ room }: { room: OccupyingRoomsQuery['occupyingRooms'][number] }) => {
  return (
    <Link href={`/app/room/${room.slug || room.id}`}>
      <UnstyledButton sx={{ height: 'unset' }} onClick={(e) => e.stopPropagation()} component="div">
        <Card
          shadow="md"
          radius="md"
          p="md"
          withBorder
          sx={(theme) => {
            const { border, background, color, hover } = theme.fn.variant({ variant: 'default' });
            return {
              backgroundColor: background,
              color,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderColor: border,
              ...theme.fn.hover({ backgroundColor: hover }),
            };
          }}
        >
          <RoomSummaryContent room={room} />
        </Card>
      </UnstyledButton>
    </Link>
  );
};

const useStyles = createStyles((_theme, _params, getRef) => ({
  group: {
    alignItems: 'flex-end',
    marginRight: '-5rem',
    [`& > .${getRef('heading')}`]: {
      flexGrow: 1,
    },
  },
  heading: {
    ref: getRef('heading'),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
}));

export const UserRoomsSummary: FC<Record<string, unknown>> = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const [{ data, fetching, error }, refetchDecks] = useQuery({
    query: OccupyingRoomsDocument,
  });
  const rooms = (data?.occupyingRooms || []).map((room, index) => (
    <RoomItem key={index} room={room} />
  ));
  return (
    <Link href="/app/rooms">
      <UnstyledButton component="div" mr="5rem">
        <Paper shadow="md" radius="md" p="md" withBorder>
          <Group className={classes.group}>
            <Title order={2} className={classes.heading} mb="md">
              Rooms
            </Title>
            <NewRoomItem />
          </Group>
          <Divider mb="md" />
          <Group>
            {rooms}
            <Text>{rooms.length ? 'View more...' : 'You are not in any rooms.'}</Text>
          </Group>
        </Paper>
      </UnstyledButton>
    </Link>
  );
};
