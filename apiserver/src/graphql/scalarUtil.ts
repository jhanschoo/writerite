import { arg, core } from "nexus";
import { NexusGenScalars } from "../../generated/nexus-typegen";

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

const argFactory =
  <
    T extends keyof NexusGenScalars,
    U extends core.GetGen2<"inputTypeShapes", T, unknown> | undefined
  >(
    type: T
  ) =>
  (opts?: core.ScalarArgConfig<U>): core.NexusArgDef<T> =>
    arg({
      type,
      ...opts,
    }) as core.NexusArgDef<T>;

export const dateTimeArg = argFactory("DateTime");
export const emailAddressArg = argFactory("EmailAddress");
export const jsonArg = argFactory("JSON");
export const jsonObjectArg = argFactory("JSONObject");
export const jwtArg = argFactory("JWT");
export const uuidArg = argFactory("UUID");
