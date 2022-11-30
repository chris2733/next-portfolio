import Masthead from "./components/masthead";
import PageTransitionWrapper from "./components/pageTransition";

const Landing = ({ pageData }: { pageData: Object }) => {
  return (
    <PageTransitionWrapper classes="bg-black">
      <Masthead pageData={pageData} />
    </PageTransitionWrapper>
  );
};

export default Landing;
