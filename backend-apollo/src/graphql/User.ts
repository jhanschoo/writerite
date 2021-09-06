import { mutationField, nonNull, objectType, queryField, stringArg } from "nexus";

export const User = objectType({
	name: "User",
	definition(t) {
		t.nonNull.uuid("id");
		t.nonNull.emailAddress("email");
		t.nonNull.string("name", {
			resolve({ name }) {
				if (name === null) {
					throw new Error("name is null");
				}
				return name;
			},
		});
		t.nonNull.list.nonNull.string("roles");

		t.nonNull.list.nonNull.field("decks", {
			type: "Deck",
			resolve({ id }, _args, { prisma }) {
				return prisma.deck.findMany({ where: { ownerId: id } });
			},
		});
		t.nonNull.list.nonNull.field("ownedRooms", {
			type: "Room",
			resolve({ id }, _args, { prisma }) {
				return prisma.room.findMany({ where: { ownerId: id } });
			},
		});
		t.nonNull.list.nonNull.field("occupyingRooms", {
			type: "Room",
			resolve({ id }, _args, { prisma }) {
				return prisma.room.findMany({ where: { occupants: { some: { occupantId: id } } } });
			},
		});
	},
});

export const UserQuery = queryField("user", {
	type: nonNull("User"),
	resolve() {
		throw Error("not implemented yet");
	},
});

export const UserEditMutation = mutationField("userEdit", {
	type: nonNull("User"),
	args: {
		name: stringArg(),
	},
	resolve() {
		throw Error("not implemented yet");
	},
});