import { mutationField, nonNull, objectType, queryField, stringArg } from "nexus";

export const User = objectType({
	name: "User",
	definition(t) {
		t.nonNull.uuid("id");
		t.nonNull.emailAddress("email");
		t.nonNull.string("name");
		t.nonNull.list.nonNull.string("roles");

		t.nonNull.list.nonNull.field("decks", {
			type: "Deck",
		});
		t.nonNull.list.nonNull.field("ownedRooms", {
			type: "Room",
		});
		t.nonNull.list.nonNull.field("occupyingRooms", {
			type: "Room",
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
