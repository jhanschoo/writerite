import { PrismaClient, RoomState } from "@prisma/client";

type RoomNotificationCreateProps = [
  PrismaClient,
  { senderId: string; receiverId: string; roomId: string }
];

/**
 * create an invitation from `senderId` inviting `receiverId` to `roomId` only if
 * at sometime past or present,
 * 1. `senderId` and `receiverId` are mutual friends
 * 2. `senderId` is an occupant of `roomId`
 * 3. `roomId` is in WAITING state
 * @param param0
 * @returns
 */
export const roomInvitationCreate = async (
  ...[prisma, { senderId, receiverId, roomId }]: RoomNotificationCreateProps
) => {
  if (
    !(await prisma.occupant.count({
      where: {
        room: {
          id: roomId,
          state: RoomState.WAITING,
        },
        occupant: {
          id: senderId,
          befrienderIn: { some: { befriendedId: receiverId } },
          befriendedIn: { some: { befrienderId: receiverId } },
        },
      },
    }))
  ) {
    return null;
  }
  return prisma.roomInvitation.upsert({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    where: { senderId_receiverId_roomId: { senderId, receiverId, roomId } },
    update: {},
    create: { senderId, receiverId, roomId },
  });
};
