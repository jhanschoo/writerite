import { ThirdPartyProfileInformation } from "./types";

const { NODE_ENV } = process.env;

export function getDevelopmentProfile({ code }: { code: string }): Promise<ThirdPartyProfileInformation | null> {
	return Promise.resolve(NODE_ENV === "production" ? null : { id: code });
}
