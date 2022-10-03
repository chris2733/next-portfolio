import { NextSeo } from "next-seo";
import AnimateIn from "./components/animateIn";
import { LetterSplitter, WordSplitter } from "./components/animateSplitter";
import PageTransitionWrapper from "./components/pageTransition";
import RoundedLinks from "./elements/roundedlinks";

const About = () => {
	const text = "About me here";
	return (
		<>
			<NextSeo title="About" />
			<PageTransitionWrapper classes="bg-gray-300 min-h-screen flex items-center justify-center">
				<div className="container py-24 sm:py-32 text-center rounded-3xl bg-white !max-w-2xl p-8 shadow-[0px_0px_112px_-2px_rgba(255,255,255,0.75)]">
					<h1 className="inline-block overflow-hidden leading-5 mb-4">
						<LetterSplitter
							text={"about"}
							initialDelay={0.4}
							letterDelay={0.03}
							letterClass="text-lg uppercase duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-default inline-block font-medium"
						/>
					</h1>
					<div className="mx-auto max-w-[730px]">
						<div className="pb-5">
							<WordSplitter
								text={text}
								initialDelay={1}
								wordDelay={0.002}
								wordClass=""
							/>
						</div>
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
									link="/work"
									buttonClasses="text-black font-bold text-sm"
									borderClasses="stroke-black"
								>
									work
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
