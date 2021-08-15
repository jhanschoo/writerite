import { arg, core } from "nexus";

export const scalarMapping = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	DateTime: "Date",
	// eslint-disable-next-line @typescript-eslint/naming-convention
	EmailAddress: "string",
	// eslint-disable-next-line @typescript-eslint/naming-convention
	JSON: "unknown",
	// eslint-disable-next-line @typescript-eslint/naming-convention
	JSONObject: "Record<string, unknown>",
	// eslint-disable-next-line @typescript-eslint/naming-convention
	JWT: "string",
	// eslint-disable-next-line @typescript-eslint/naming-convention
	UUID: "string",
};

export const dateTimeArg = (opts?: core.ScalarArgConfig<Date>): core.NexusArgDef<"DateTime"> =>
	arg({
		type: "DateTime",
		...opts,
	}) as core.NexusArgDef<"DateTime">;

export const emailAddressArg = (opts?: core.ScalarArgConfig<string>): core.NexusArgDef<"EmailAddress"> =>
	arg({
		type: "EmailAddress",
		...opts,
	}) as core.NexusArgDef<"EmailAddress">;

export const uuidArg = (opts?: core.ScalarArgConfig<string>): core.NexusArgDef<"UUID"> =>
	arg({
		type: "UUID",
		...opts,
	}) as core.NexusArgDef<"UUID">;

export const jsonArg = (opts?: core.ScalarArgConfig<unknown>): core.NexusArgDef<"JSON"> =>
	arg({
		type: "JSON",
		...opts,
	}) as core.NexusArgDef<"JSON">;

export const jsonObjectArg = (opts?: core.ScalarArgConfig<Record<string, unknown>>): core.NexusArgDef<"JSONObject"> =>
	arg({
		type: "JSONObject",
		...opts,
	}) as core.NexusArgDef<"JSONObject">;
