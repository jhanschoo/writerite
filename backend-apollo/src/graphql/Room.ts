import { enumType, list, mutationField, nonNull, objectType, queryField } from "nexus";
import { emailAddressArg, jsonObjectArg, uuidArg } from "./scalarUtils";

export const Room = objectType({
	name: "Room",
	definition(t) {
		t.nonNull.uuid("id");
		t.nonNull.uuid("ownerId");
		t.nonNull.jsonObject("ownerConfig");
		t.nonNull.jsonObject("internalConfig");
		t.nonNull.field("state", {
			type: "RoomState",
		});

		t.nonNull.field("owner", {
			type: "User",
		});
		t.nonNull.list.nonNull.field("occupants", {
			type: "User",
		});
		t.nonNull.list.nonNull.field("messages", {
			type: "Message",
		});
	},
});

export const RoomState = enumType({
	name: "RoomState",
	members: ["WAITING", "SERVING", "SERVED"],
});

export const RoomQuery = queryField("room", {
	type: nonNull("Room"),
	resolve() {
		throw Error("not implemented yet");
	},
});

export const OccupyingRoomsQuery = queryField("occupyingRooms", {
	type: nonNull(list(nonNull("Room"))),
	resolve() {
		throw Error("not implemented yet");
	},
});

export const RoomCreateMutation = mutationField("roomCreate", {
	type: nonNull("Room"),
	args: {
		ownerConfig: nonNull(jsonObjectArg()),
	},
	description: `@subscriptionsTriggered(
    signatures: ["roomUpdates", "roomsUpdates"]
  )`,
	resolve() {
		throw Error("not implemented yet");
	},
});

// Only legal when room state is WAITING
export const RoomEditOwnerConfigMutation = mutationField("roomEditOwnerConfig", {
	type: nonNull("Room"),
	args: {
		id: nonNull(uuidArg()),
		ownerConfig: nonNull(jsonObjectArg()),
	},
	description: `@subscriptionsTriggered(
    signatures: ["roomUpdates", "roomsUpdates"]
  )`,
	resolve() {
		throw Error("not implemented yet");
	},
});

export const RoomSetStateMutation = mutationField("roomSetState", {
	type: nonNull("Room"),
	args: {
		id: nonNull(uuidArg()),
		state: nonNull("RoomState"),
	},
	description: `@subscriptionsTriggered(
    signatures: ["roomUpdates", "roomsUpdates"]
  )`,
	resolve() {
		throw Error("not implemented yet");
	},
});

export const RoomCleanUpDeadMutation = mutationField("roomCleanUpDead", {
	type: nonNull("Int"),
	description: `@subscriptionsTriggered(
    signatures: ["roomUpdates", "roomsUpdates"]
  )`,
	resolve() {
		throw Error("not implemented yet");
	},
});

// Only legal when room state is WAITING
export const RoomAddOccupantMutation = mutationField("roomAddOccupant", {
	type: nonNull("Room"),
	args: {
		id: nonNull(uuidArg()),
		occupantId: nonNull(uuidArg()),
	},
	description: `@subscriptionsTriggered(
    signatures: ["roomUpdates", "roomsUpdates"]
  )`,
	resolve() {
		throw Error("not implemented yet");
	},
});

// Only legal when room state is WAITING
export const RoomAddOccupantByEmailMutation = mutationField("roomAddOccupantByEmail", {
	type: nonNull("Room"),
	args: {
		id: nonNull(uuidArg()),
		email: nonNull(emailAddressArg()),
	},
	description: `@subscriptionsTriggered(
    signatures: ["roomUpdates", "roomsUpdates"]
  )`,
	resolve() {
		throw Error("not implemented yet");
	},
});
