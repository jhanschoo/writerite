import { builder, gao, ungao } from "../builder";

export enum RoomState {
  WAITING = "WAITING",
  SERVING = "SERVING",
  SERVED = "SERVED",
  PERSISTENT = "PERSISTENT",
}

builder.enumType(RoomState, {
  name: "RoomState",
});

export const PSUMMARY = gao("getPublicInfo");
export const PDETAIL = gao("getDetailInfo");
export const PSETUP = gao("editInfo");

// note that persistent rooms rely on the type not being accessible from the graph
// except by its occupants in the first place for access control.
// PERSSISTENT_PERMS is the minimal set of permissions that a user has on persistent rooms.
const PERSISTENT_PERMS = ungao([PSUMMARY, PDETAIL, PSETUP]);
// OCCUPANT_PERMS is the minimal set of permissions that an occupant of an active ephemeral room has on that room.
const OCCUPANT_PERMS = ungao([PSUMMARY, PDETAIL, PSETUP]);
// PUBLIC_PERMS is the minimal set of permissions that a user has on a room.
const PUBLIC_PERMS = ungao([PSUMMARY]);

export const Room = builder.prismaNode("Room", {
  authScopes: {
    authenticated: true,
  },
  grantScopes: ({ slug, state }, { auth }) => {
    if (state === RoomState.PERSISTENT) {
      return PERSISTENT_PERMS;
    }
    if (slug && auth.isOccupyingActiveRoom(slug)) {
      return OCCUPANT_PERMS;
    }
    return PUBLIC_PERMS;
  },
  id: { field: "id" },
  fields: (t) => ({
    deckId: t.exposeID("deckId", { nullable: true }),
    slug: t.exposeString("slug", { nullable: true }),

    deck: t.relation("deck"),
    // TODO: orderBy
    messages: t.relatedConnection("chatMsgs", { cursor: "id" }),
    messageCount: t.relationCount("chatMsgs"),
    occupantsCount: t.relationCount("occupants"),
  }),
});
