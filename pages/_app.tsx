import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { AnimatePresence, motion } from "framer-motion";
import { DefaultSeo } from "next-seo";

function MyApp({ Component, pageProps, router }: AppProps) {
	return (
		// mode="wait" apparently might cause issues, error in console, but causes scrollbar issues on page transition otherwise
		<AnimatePresence mode="wait">
			<DefaultSeo
				title="Home"
				defaultTitle="Chris Law"
				description="Chris's Portfolio"
				titleTemplate="Chris Law | %s"
				languageAlternates={[
					{
						hrefLang: "en-GB",
						href: "/",
					},
				]}
				// for later
				// openGraph={{
				//   type: 'website',
				//   locale: 'en_IE',
				//   url: 'https://www.url.ie/',
				//   site_name: 'SiteName',
				// }}
			/>
			<Component {...pageProps} key={router.route} />
		</AnimatePresence>
	);
}

export default MyApp;
