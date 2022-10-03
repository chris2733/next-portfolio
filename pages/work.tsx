import Link from "next/link";
import LetterSplitter from "./components/animateSplitter";
import PageTransitionWrapper from "./components/pageTransition";
import { NextSeo } from "next-seo";

const About = () => {
	const WorkSites: { title: string; description: string; link: string }[] = [
		{
			title: "Cadw",
			description:
				"Welsh Government&quot;s historic environment service, with a focus on accessibilty",
			link: "https://cadw.gov.wales/",
		},
		{
			title: "Burns Pet Food",
			description:
				"Large eccommerce site done in Wordpress, using Twig templating along with webpack with Sass and Bootstrap",
			link: "https://burnspet.co.uk/",
		},
		{
			title: "Hamilton Gardens",
			description:
				"Brochure site for apartments in Dublin, with Vue, Nuxt & Tailwind",
			link: "https://hamiltongardens.ie/",
		},
		{
			title: "Hensol Castle",
			description:
				"Wedding and conference venue in historic building, focusing on animations and visuals, with Wordpress & Twig, using Sass alongside Bootstrap and Jquery",
			link: "https://www.hensolcastle.com/",
		},
	];

	return (
		<>
			<NextSeo title="Work" />
			<PageTransitionWrapper classes="bg-white">
				<div className="container py-32 sm:py-[20vw] lg:py-[15vw] text-center">
					<h1 className="inline-block overflow-hidden leading-5">
						<LetterSplitter
							text={"work"}
							initialDelay={0.5}
							letterDelay={0.03}
							letterClass="text-lg uppercase duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-default inline-block mx-[1px"
						/>
					</h1>
					<div className="">
						<ul>
							{WorkSites.map((el, i) => (
								<li className="">
									<Link href={el.link}>
										<div className="mb-2">
											<h3 className="inline font-bold">{el.title}</h3>
											<p className="inline"> - {el.description}</p>
										</div>
									</Link>
								</li>
							))}
						</ul>
						<Link href="/">
							<a>Home</a>
						</Link>
					</div>
				</div>
			</PageTransitionWrapper>
		</>
	);
};

export default About;
