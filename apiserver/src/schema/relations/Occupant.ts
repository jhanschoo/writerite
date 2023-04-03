import { builder } from "../../builder";
// import { Room } from '../Room';
// import { WillNotServeRoomStates } from '../../service/room';
// import { isPublicOrLoggedIn } from '../User';

export const Occupant = builder.prismaNode("Occupant", {
  id: { field: "id" },
  fields: (t) => ({
    roomId: t.exposeID("roomId"),
    occupantId: t.exposeID("occupantId"),

    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),

    room: t.relation("room"),
    occupant: t.relation("occupant"),
  }),
});

// TODO: change functional purpose to 'rooms with friends'
// builder.prismaObjectFields('User', (t) => ({
//   occupyingActiveRooms: t.field({
//     type: [Room],
//     authScopes: isPublicOrLoggedIn,
//     description: 'all active rooms this user is occupying',
//     select: (_args, _ctx, nestedSelection) => ({
//       occupyingRooms: {
//         select: {
//           room: nestedSelection(true),
//         },
//         where: {
//           room: {
//             state: {
//               notIn: WillNotServeRoomStates,
//             },
//           },
//         },
//       },
//     }),
//     resolve: ({ occupyingRooms }) => occupyingRooms.map(({ room }) => room),
//   }),
// }));
