import { GetServerSideProps, NextPage } from "next";
import { useQuery } from "urql";
import { initDefaultServerSideUrqlClient } from "@lib/urql/initDefaultServerSideUrqlClient";
import { HealthQueryDocument } from "@generated/graphql";

export const getServerSideProps: GetServerSideProps = async () => {
	const [client, getUrqlState] = initDefaultServerSideUrqlClient();

	await client.query(HealthQueryDocument).toPromise();

	return {
		props: {
			urqlState: getUrqlState(),
		},
	}
}

const Ssr: NextPage = () => {
	const [result] = useQuery({
		query: HealthQueryDocument,
	});
	return (
		<p>{JSON.stringify(result.data)}</p>
	);
}

export default Ssr;
