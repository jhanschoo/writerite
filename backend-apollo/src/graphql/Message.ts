import { enumType, list, mutationField, nonNull, objectType, queryField } from "nexus";
import { jsonArg, uuidArg } from "./scalarUtils";

export const Message = objectType({
	name: "Message",
	definition(t) {
		t.nonNull.uuid("id");
		t.nonNull.uuid("roomId");
		t.uuid("senderId");
		t.nonNull.field("contentType", {
			type: "MessageContentType",
		});
		t.nonNull.json("content");
		t.nonNull.dateTime("createdAt");

		t.field("sender", {
			type: "User",
		});
		t.field("room", {
			type: "Room",
		});
	},
});

export const MessageContentType = enumType({
	name: "MessageContentType",
	members: ["TEXT", "CONFIG", "ROUND_START", "ROUND_WIN", "ROUND_SCORE", "CONTEST_SCORE"],
});

export const MessageQuery = queryField("message", {
	type: nonNull("Message"),
	args: {
		id: uuidArg(),
	},
	resolve() {
		throw Error("not implemented yet");
	},
});

export const MessagesOfRoomQuery = queryField("messagesOfRoom", {
	type: nonNull(list(nonNull("Message"))),
	args: {
		id: uuidArg(),
	},
	resolve() {
		throw Error("not implemented yet");
	},
});

export const MessageCreateMutation = mutationField("messageCreate", {
	type: nonNull("Message"),
	args: {
		roomId: nonNull(uuidArg()),
		type: nonNull("MessageContentType"),
		content: jsonArg(),
	},
	resolve() {
		throw Error("not implemented yet");
	},
	description: `@subscriptionsTriggered(
    signatures: ["chatMsgsOfRoomUpdates"]
  )`,
});
