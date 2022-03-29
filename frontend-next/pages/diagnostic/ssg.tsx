import { GetStaticProps, NextPage } from "next";
import { useQuery } from "urql";
import { initDefaultUrqlClient } from "../../lib/server/urql/initDefaultUrqlClient";
import { HealthQueryDocument } from "../../generated/graphql";

export const getStaticProps: GetStaticProps = async () => {
	const [client, getUrqlState] = initDefaultUrqlClient();

	await client.query(HealthQueryDocument).toPromise();

	return {
		props: {
			urqlState: getUrqlState(),
		},
		revalidate: 600,
	}
}

const Ssg: NextPage = () => {
	const [result, reexecuteQuery] = useQuery({
		query: HealthQueryDocument,
	});
	return (
		<p>{JSON.stringify(result.data)}</p>
	);
}

export default Ssg;