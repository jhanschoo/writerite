import { ApolloClient } from "@apollo/client";
import { createClient } from "../../core/frameworks/apollo";

let browserClient: ApolloClient<any>;

export const getBrowserClient = async () => {
	if (!browserClient) {
		browserClient = await createClient({ ssr: false })
	}
	return browserClient;
};
