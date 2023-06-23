import LetterSplitter from "components/letterSplitter";
import WordSplitter from "components/workSplitter";
import PageTransitionWrapper from "components/pageTransition";
import { NextSeo } from "next-seo";
import RoundedLinks from "elements/roundedlinks";
import AnimateIn from "components/animateIn";
import { getDocuments } from "outstatic/server";

const Work = ({ pageContent }: { pageContent: any }) => {
  return (
    <>
      <NextSeo title="Work" />
      <PageTransitionWrapper classes="bg-white min-h-screen flex items-center justify-center">
        <div className="container py-24 sm:py-32 text-center">
          <h1 className="inline-block overflow-hidden leading-5 mb-4">
            <LetterSplitter
              text={"showcase"}
              initialDelay={0.5}
              letterDelay={0.03}
              letterClass="text-lg uppercase duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-default inline-block font-medium"
            />
          </h1>
          <div className="mx-auto max-w-[730px]">
            <ul className="pb-5">
              {pageContent
                .slice()
                .reverse()
                .map((el: any, i: number) => (
                  <li className="" key={`work${i}`}>
                    <a href={el.link} target="_blank" rel="noreferrer">
                      <div className="mb-2 cursor-pointer text-sm md:text-base">
                        <WordSplitter
                          text={el.content}
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
                  strokeColour="black"
                >
                  home
                </RoundedLinks>
              </AnimateIn>
              <AnimateIn delay={2.1} duration={0.6}>
                <RoundedLinks
                  link="/about"
                  buttonClasses="text-black font-bold text-sm"
                  strokeColour="black"
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

export default Work;

export const getStaticProps = async () => {
  const pageContent = getDocuments("work", ["title", "content"]);
  return {
    props: { pageContent },
  };
};
