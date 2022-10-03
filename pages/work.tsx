import { LetterSplitter, WordSplitter } from "./components/animateSplitter";
import PageTransitionWrapper from "./components/pageTransition";
import { NextSeo } from "next-seo";
import RoundedLinks from "./elements/roundedlinks";
import AnimateIn from "./components/animateIn";

const About = () => {
	const WorkSites: { title: string; description: string; link: string }[] = [
		{
			title: "Cadw",
			description:
				"Welsh Government's historic environment service, with a focus on accessibilty",
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
		{
			title: "Repool",
			description:
				"Hedge fund services site built as a headless Wordpress CMS with Nextjs and Tailwind",
			link: "https://repool.com/",
		},
	];

	return (
		<>
			<NextSeo title="Work" />
			<PageTransitionWrapper classes="bg-white min-h-screen flex items-center justify-center">
				<div className="container py-24 sm:py-32 text-center">
					<h1 className="inline-block overflow-hidden leading-5 mb-4">
						<LetterSplitter
							text={"work"}
							initialDelay={0.5}
							letterDelay={0.03}
							letterClass="text-lg uppercase duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-default inline-block font-medium"
						/>
					</h1>
					<div className="mx-auto max-w-[730px]">
						<ul className="pb-5">
							{WorkSites.map((el, i) => (
								<li className="" key={`work${i}`}>
									<a href={el.link} target="_blank" rel="noreferrer">
										<div className="mb-2 cursor-pointer">
											<WordSplitter
												text={el.description}
												boldText={el.title}
												initialDelay={0.07 * (i + 1) + 1}
												wordDelay={0.002 * (i + 1)}
												wordClass=""
											/>
										</div>
									</a>
								</li>
							))}
						</ul>
						<div className="mt-2 flex items-center justify-center gap-3">
							<AnimateIn delay={2} duration={0.6}>
								<RoundedLinks
									link="/"
									buttonClasses="text-black font-bold text-sm"
									borderClasses="stroke-black"
								>
									home
								</RoundedLinks>
							</AnimateIn>
							<AnimateIn delay={2.1} duration={0.6}>
								<RoundedLinks
									link="/about"
									buttonClasses="text-black font-bold text-sm"
									borderClasses="stroke-black"
								>
									about
								</RoundedLinks>
							</AnimateIn>
						</div>
					</div>
				</div>
			</PageTransitionWrapper>
		</>
	);
};

export default About;
