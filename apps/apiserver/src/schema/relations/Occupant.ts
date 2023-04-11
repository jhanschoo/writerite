import { builder } from "../../builder";
// import { Room } from '../Room';
// import { WillNotServeRoomStates } from '../../service/room';
// import { isPublicOrLoggedIn } from '../User';

export const Occupant = builder.prismaNode("Occupant", {
  id: { field: "id" },
  fields: (t) => ({
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),

    room: t.relation("room"),
    occupant: t.relation("occupant"),
  }),
});
