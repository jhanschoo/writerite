import { booleanArg, idArg, mutationField, nonNull, objectType, queryField, stringArg } from "nexus";
import type { Context } from "../context";
import { userLacksPermissionsErrorFactory } from "../error/userLacksPermissionsErrorFactory";
import { guardLoggedIn } from "../service/authorization/guardLoggedIn";

const isPublicOrLoggedInOrAdmin = ({ id, isPublic }: { id: string, isPublic: boolean }, _args: unknown, { auth }: Context) => isPublic || auth.isLoggedInAs(id) || auth.isAdmin;

export const User = objectType({
	name: "User",
	definition(t) {
		t.nonNull.id("id");
		t.nonNull.emailAddress("email", { authorize: isPublicOrLoggedInOrAdmin });
		t.nonNull.string("name", { authorize: isPublicOrLoggedInOrAdmin });
		t.nonNull.list.nonNull.string("roles", { authorize: isPublicOrLoggedInOrAdmin });
		t.nonNull.boolean("isPublic");

		t.nonNull.list.nonNull.field("decks", {
			type: "Deck",
			authorize: isPublicOrLoggedInOrAdmin,
			resolve({ id }, _args, { prisma }) {
				return prisma.deck.findMany({ where: { ownerId: id } });
			},
		});
		t.nonNull.list.nonNull.field("ownedRooms", {
			type: "Room",
			authorize: isPublicOrLoggedInOrAdmin,
			resolve({ id }, _args, { prisma }) {
				return prisma.room.findMany({ where: { ownerId: id } });
			},
		});
		t.nonNull.list.nonNull.field("occupyingRooms", {
			type: "Room",
			authorize: isPublicOrLoggedInOrAdmin,
			resolve({ id }, _args, { prisma }) {
				return prisma.room.findMany({ where: { occupants: { some: { occupantId: id } } } });
			},
		});
	},
});

export const UserQuery = queryField("user", {
	type: nonNull("User"),
	args: {
		id: nonNull(idArg()),
	},
	resolve: async (_source, { id }, { prisma }) => {
		const res = await prisma.user.findUnique({
			where: { id },
		});
		if (!res) {
			throw userLacksPermissionsErrorFactory();
		}
		return res;
	},
});

export const UserEditMutation = mutationField("userEdit", {
	type: nonNull("User"),
	args: {
		name: stringArg({ undefinedOnly: true }),
		isPublic: booleanArg({ undefinedOnly: true }),
	},
	resolve: guardLoggedIn(async (_source, { name, isPublic }, { sub, prisma }) => {
		try {
			return await prisma.user.update({
				where: { id: sub.id },
				data: { name: name ?? undefined, isPublic: isPublic ?? undefined },
			});
		} catch (err) {
			throw userLacksPermissionsErrorFactory();
		}
	}),
});