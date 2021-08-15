import { plugin } from "nexus";
import { printedGenTyping } from "nexus/dist/utils";

const undefinedOnly = printedGenTyping({
	name: "undefinedOnly",
	optional: true,
	type: "boolean",
	description: `\
	Whether the type, if nullable, allows only \`undefined\` values; i.e.
	\`null\` values are an error.
	`,
});

export const undefinedOnlyPlugin = plugin({
	name: "UndefinedOnlyPlugin",
	description: `\
		The undefined only plugin allows defining a nullable argument to only
		allow \`undefined\` nullish values; i.e. \`null\` values are an error.
		This is useful for optional arguments corresponding to non-null fields
		in arguments.

		The plugin is still under development and may not provide validation
		or the proper types; but it is still good for documentation.
	`,
	inputFieldDefTypes: undefinedOnly,
	argTypeDefTypes: undefinedOnly,
});
