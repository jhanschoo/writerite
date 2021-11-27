import { AuthenticationProvider } from "./types";
import { localAuthenticationProvider } from "./localAuthenticationProvider";

const { NODE_ENV } = process.env;

export const developmentAuthenticationProvider: AuthenticationProvider = {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	signin: localAuthenticationProvider.signin,
	verify(_token: string) {
		if (NODE_ENV === "development" || NODE_ENV === "test") {
			return Promise.resolve("dev");
		}
		return Promise.resolve(null);
	},
};
