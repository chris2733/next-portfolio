import AnimateIn from "./animateIn";
import LetterSplitter from "./../components/letterSplitter";
import RoundedLinks from "./../elements/roundedlinks";

const Masthead = () => {
  interface fieldTypes {
    titles?: any;
    links?: any;
  }
  const fields: fieldTypes = {
    titles: [{ title: "Chris Law" }, { title: "front end developer" }],
  };
  const headlineClasses =
    "hover:text-blue-300 duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-default inline-block mx-[1px] text-masthead";
  return (
    <div className="min-h-screen text-white flex justify-center items-center">
      <div className="container text-center uppercase">
        <div className="block">
          {fields.titles &&
            fields.titles.map((titles: any, index: number) => {
              const titlesSplit = titles.title.split(" ");
              return (
                <div key={`titlesplitter${index}`}>
                  {index === 0 ? (
                    <h1 className="inline-block overflow-hidden leading-5">
                      {titlesSplit.map((title: string, subIndex: number) => (
                        <span key={`titleseach${index}${subIndex}`}>
                          {/* gap between words */}
                          {subIndex !== 0 && " "}
                          <LetterSplitter
                            text={title}
                            initialDelay={0.4 + 0.2 * subIndex}
                            letterDelay={0.03}
                            letterClass={headlineClasses}
                          />
                        </span>
                      ))}
                    </h1>
                  ) : (
                    <h2 className="inline-block overflow-hidden mr-1 leading-5">
                      {titlesSplit.map((title: string, subIndex: number) => (
                        <span key={`titleseach${index}${subIndex}`}>
                          {/* gap between words */}
                          {subIndex !== 0 && " "}
                          <LetterSplitter
                            text={title}
                            initialDelay={1 + 0.3 * subIndex}
                            letterDelay={0.03}
                            letterClass={headlineClasses}
                          />
                        </span>
                      ))}
                    </h2>
                  )}
                </div>
              );
            })}
        </div>
        <div className="text-sm mt-2 flex items-center justify-center gap-3 font-medium">
          <AnimateIn delay={1.8} duration={0.6}>
            <RoundedLinks link="/about">about</RoundedLinks>
          </AnimateIn>
          <AnimateIn delay={1.9} duration={0.6}>
            <RoundedLinks link="/work">work</RoundedLinks>
          </AnimateIn>
        </div>
      </div>
    </div>
  );
};

export default Masthead;
