import type { NextPage } from "next";
import Nexthome from "./components/nexthome";
import Landing from "./landing";
import { SliceZone } from "@prismicio/react";
import { createClient } from "./prismicio";

const Home: NextPage = (page: any) => {
	console.log(page);
	return <Landing />;
};

export default Home;

export async function getStaticProps() {
	const client = createClient();

	const page = await client.getSingle("homepage");

	return {
		props: {
			page,
		},
	};
}
