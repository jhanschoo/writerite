import { PropsWithChildren } from 'react';
import { useQuery } from 'urql';
import { OccupyingActiveRoomsDocument, OccupyingActiveRoomsQuery } from '@generated/graphql';
import { Avatar, Button, Card, createStyles, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { alertGradient, alertGradientHover } from '@/lib/mantine/fns';
import { ProfilePicture } from '@/features/profilePicture/components';
import { FriendActivity } from './FriendActivity';
import { ROOM_DETAIL_PATH } from '@/paths';
import { useRouter } from 'next/router';

export const USER_DECK_SUMMARY_DECKS_NUM = 20;

const useStyles = createStyles((theme) => {
  return {
    roomItem: {
      backgroundImage: alertGradient(theme),
      color: theme.white,
      ...theme.fn.hover({
        backgroundImage: alertGradientHover(theme),
      }),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatarGroup: {
      display: 'inline-flex',
    },
    roomItemButton: {
      borderColor: theme.white,
      color: theme.white,
      minWidth: '25%',
      ...theme.fn.hover({
        background: 'none',
      }),
    },
    roomItemText: {
      fontSize: theme.fontSizes.xl,
      [`@media (min-width: ${theme.breakpoints.sm})`]: {
        fontSize: `calc(${theme.fontSizes.xl} * 1.5)`,
      },
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        fontSize: `calc(${theme.fontSizes.xl} * 2)`,
      },
    },
  };
});

const RoomItem = ({
  room,
}: {
  room: OccupyingActiveRoomsQuery['occupyingActiveRooms'][number];
}) => {
  const roomName = room.slug || room.id;
  const { classes } = useStyles();
  const router = useRouter();
  return (
    <UnstyledButton onClick={() => router.push(ROOM_DETAIL_PATH(roomName))} component="div">
      <Card shadow="xl" radius="lg" mx="lg" className={classes.roomItem}>
        <Text fw="bolder" ta="center" m="md" className={classes.roomItemText}>
          You are currently in room {roomName} with{' '}
          <Avatar.Group spacing="xl" className={classes.avatarGroup}>
            <ProfilePicture user={{ id: 'adwwerooWEowowww', name: 'A' }} showTooltip />
            <ProfilePicture user={{ id: 'adwderooWqadfvowww', name: 'B' }} showTooltip />
            <ProfilePicture user={{ id: 'agwwewfwfweEowowww', name: 'C' }} showTooltip />
          </Avatar.Group>
          .
        </Text>
        <Button variant="outline" className={classes.roomItemButton} radius="xl">
          Rejoin
        </Button>
      </Card>
    </UnstyledButton>
  );
};

interface Props {
  wrapper: (props: PropsWithChildren) => JSX.Element;
}

export const RoomNotifications = ({ wrapper: Wrapper }: Props) => {
  const [{ data, fetching, error }, refetchRooms] = useQuery({
    query: OccupyingActiveRoomsDocument,
  });
  const rooms = (data?.occupyingActiveRooms || []).map((room, index) => (
    <Wrapper key={index}>
      <RoomItem room={room} />
    </Wrapper>
  ));
  if (rooms.length) {
    return <>{rooms}</>;
  }
  return (
    <Wrapper key="friend-activity">
      <FriendActivity />
    </Wrapper>
  );
};
