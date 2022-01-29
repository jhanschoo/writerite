import { NextPage } from "next";
import { useQuery } from "urql";
import { HealthQueryDocument } from "../../generated/graphql";

const ClientOnly: NextPage = () => {
	const [result, reexecuteQuery] = useQuery({
		query: HealthQueryDocument,
	});
	return (
		<p>{JSON.stringify(result.data)}</p>
	);
}

export default ClientOnly;
