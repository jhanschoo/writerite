import { idArg, mutationField, nonNull, objectType } from 'nexus';
import { guardValidUser } from '../service/authorization';
import { roomInvitationCreate } from '../service/roomInvitation';

export const RoomInvitation = objectType({
  name: 'RoomInvitation',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.id('roomId');
    t.nonNull.id('senderId');
    t.nonNull.id('receiverId');
  },
});

export const RoomInvitationSendMutation = mutationField('roomInvitationSend', {
  type: 'RoomInvitation',
  args: {
    receiverId: nonNull(idArg()),
    roomId: nonNull(idArg()),
  },
  resolve: guardValidUser(async (_parent, { receiverId, roomId }, { prisma, redis, sub }) => {
    const { id } = sub;
    return roomInvitationCreate(prisma, { senderId: id, receiverId, roomId });
  }),
});
