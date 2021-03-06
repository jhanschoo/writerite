import { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { ProfilePicture } from '@/features/profilePicture/components';
import { ROOM_DETAIL_PATH } from '@/paths';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import {
  Avatar,
  Button,
  Card,
  Text,
  Tooltip,
  UnstyledButton,
  createStyles,
} from '@mantine/core';
import { useQuery } from 'urql';

import { alertGradient, alertGradientHover } from '@/lib/mantine/fns';

import { FriendActivity } from './FriendActivity';

export const USER_DECK_SUMMARY_DECKS_NUM = 20;

const RoomNotificationsRoomItemFragment = graphql(/* GraphQL */ `
  fragment RoomNotificationsRoomItem on Room {
    id
    occupants {
      id
      bareId
      name
    }
    activeRound {
      id
      slug
      deck {
        id
        name
      }
    }
  }
`);

const useStyles = createStyles((theme) => ({
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
}));

const RoomItem = ({
  room,
}: {
  room: FragmentType<typeof RoomNotificationsRoomItemFragment>;
}) => {
  const roomFragment = useFragment(RoomNotificationsRoomItemFragment, room);
  const { id, activeRound, occupants } = roomFragment;
  const roomName = activeRound?.slug || id;
  const { classes } = useStyles();
  const router = useRouter();
  return (
    <UnstyledButton
      onClick={() => router.push(ROOM_DETAIL_PATH(id))}
      component="div"
    >
      <Card shadow="xl" radius="lg" mx="lg" className={classes.roomItem}>
        <Text fw="bolder" ta="center" m="md" className={classes.roomItemText}>
          You are currently in a room with{' '}
          <Avatar.Group spacing="xl" className={classes.avatarGroup}>
            {occupants.map((occupant, index) => (
              <ProfilePicture user={occupant} key={index} showTooltip />
            ))}
          </Avatar.Group>
          .
        </Text>
        <Button
          variant="outline"
          className={classes.roomItemButton}
          radius="xl"
        >
          Rejoin
        </Button>
      </Card>
    </UnstyledButton>
  );
};

const RoomNotificationsQuery = graphql(/* GraphQL */ `
  query RoomNotifications {
    occupyingUnarchivedEphemeralRooms {
      ...RoomNotificationsRoomItem
    }
  }
`);

interface Props {
  wrapper: (props: PropsWithChildren) => JSX.Element;
}

export const RoomNotifications = ({ wrapper: Wrapper }: Props) => {
  const [{ data, fetching, error }, refetchRooms] = useQuery({
    query: RoomNotificationsQuery,
  });
  const rooms = (data?.occupyingUnarchivedEphemeralRooms || []).map(
    (room, index) => (
      <Wrapper key={index}>
        <RoomItem room={room} />
      </Wrapper>
    )
  );
  if (rooms.length) {
    return <>{rooms}</>;
  }
  return (
    <Wrapper key="friend-activity">
      <FriendActivity />
    </Wrapper>
  );
};
