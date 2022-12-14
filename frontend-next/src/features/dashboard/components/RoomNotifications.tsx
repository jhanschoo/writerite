import { FC, Key, PropsWithChildren } from 'react';
import { useQuery } from 'urql';
import { OccupyingActiveRoomsDocument, OccupyingActiveRoomsQuery } from '@generated/graphql';
import { Avatar, Button, Card, createStyles, Text, Tooltip, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import { alertGradient, alertGradientHover } from '@/lib/mantine/fns';
import { generatedAvatarUrl } from '@/utils/generatedAvatarUrl';
import { ProfilePicture } from '@/features/profilePicture/components';
import { FriendActivity } from './FriendActivity';

export const USER_DECK_SUMMARY_DECKS_NUM = 20;

// const NewRoomItem = () => {
//   const router = useRouter();
//   const { setMotionProps } = useMotionContext();
//   const [, roomCreateMutation] = useMutation(RoomCreateDocument);
//   const handleCreateRoom = async (e: MouseEvent) => {
//     e.stopPropagation();
//     setMotionProps(motionThemes.forward);
//     const createdRoom = await roomCreateMutation({});
//     if (createdRoom.data?.roomCreate) {
//       router.push(
//         `/app/room/${createdRoom.data.roomCreate.slug || createdRoom.data.roomCreate.id}`
//       );
//     }
//   };

//   return (
//     <Button onClick={handleCreateRoom} size="md" radius="xl" mb="md">
//       Start a new Room
//     </Button>
//   );
// };

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
      fontSize: theme.fontSizes.xl * 2,
      [`@media (max-width: ${theme.breakpoints.md}px)`]: {
        fontSize: theme.fontSizes.xl * 1.5,
      },
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        fontSize: theme.fontSizes.xl,
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
  return (
    <Link href={`/app/room/${roomName}`}>
      <UnstyledButton onClick={(e) => e.stopPropagation()} component="div">
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
    </Link>
  );
};

interface Props {
  wrapper: FC<PropsWithChildren>;
}

export const RoomNotifications: FC<Props> = ({ wrapper: Wrapper }) => {
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
  return <FriendActivity />;
};
