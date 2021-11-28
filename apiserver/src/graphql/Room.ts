import { Prisma } from "@prisma/client";
import { enumType, idArg, list, mutationField, nonNull, objectType, queryField } from "nexus";
import { userLacksPermissionsErrorFactory } from "../error/userLacksPermissionsErrorFactory";
import { guardLoggedIn } from "../service/authorization/guardLoggedIn";
import { emailAddressArg, jsonObjectArg } from "./scalarUtil";

export const Room = objectType({
	name: "Room",
	definition(t) {
		t.nonNull.id("id");
		t.nonNull.id("ownerId");
		t.nonNull.jsonObject("ownerConfig", {
			resolve({ ownerConfig }) {
				return ownerConfig as Prisma.JsonObject;
			},
		});
		t.nonNull.jsonObject("internalConfig", {
			resolve({ internalConfig }) {
				return internalConfig as Prisma.JsonObject;
			},
		});
		t.nonNull.field("state", {
			type: "RoomState",
		});

		t.nonNull.field("owner", {
			type: "User",
			async resolve({ ownerId }, _args, { prisma }) {
				const user = await prisma.user.findUnique({ where: { id: ownerId } });
				if (user === null) {
					throw new Error(`Could not find user with id ${ownerId}`);
				}
				return user;
			},
		});
		t.nonNull.list.nonNull.field("occupants", {
			type: "User",
			resolve({ id }, _args, { prisma }) {
				return prisma.user.findMany({ where: { occupyingRooms: { some: { roomId: id } } } });
			},
		});
		t.nonNull.list.nonNull.field("messages", {
			type: "Message",
			resolve({ id }, _args, { prisma }) {
				return prisma.message.findMany({ where: { roomId: id } });
			},
		});
	},
});

export const RoomState = enumType({
	name: "RoomState",
	members: ["WAITING", "SERVING", "SERVED"],
});

export const RoomQuery = queryField("room", {
	type: nonNull("Room"),
	args: { id: nonNull(idArg()) },
	resolve: guardLoggedIn(async (_source, { id }, { prisma }) => {
		const res = await prisma.room.findUnique({
			where: { id },
		});
		if (!res) {
			throw userLacksPermissionsErrorFactory();
		}
		return res;
	}),
});

export const OccupyingRoomsQuery = queryField("occupyingRooms", {
	type: nonNull(list(nonNull("Room"))),
	resolve: guardLoggedIn((_source, _args, { sub, prisma }) => prisma.room.findMany({
		where: { occupants: { some: { id: sub.id } } },
	})),
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
		id: nonNull(idArg()),
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
		id: nonNull(idArg()),
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
		id: nonNull(idArg()),
		occupantId: nonNull(idArg()),
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
		id: nonNull(idArg()),
		email: nonNull(emailAddressArg()),
	},
	description: `@subscriptionsTriggered(
    signatures: ["roomUpdates", "roomsUpdates"]
  )`,
	resolve() {
		throw Error("not implemented yet");
	},
});