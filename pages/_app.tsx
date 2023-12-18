import "../public/globals.scss";
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
        additionalLinkTags={Favicons()}
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

const Favicons = () => [
  {
    rel: "icon",
    href: "/favicomatic/favicon.ico",
  },
  {
    rel: "apple-touch-icon-precomposed",
    sizes: "57x57",
    href: "/favicomatic/apple-touch-icon-57x57.png",
  },
  {
    rel: "apple-touch-icon-precomposed",
    sizes: "114x114",
    href: "/favicomatic/apple-touch-icon-114x114.png",
  },
  {
    rel: "apple-touch-icon-precomposed",
    sizes: "72x72",
    href: "/favicomatic/apple-touch-icon-72x72.png",
  },
  {
    rel: "apple-touch-icon-precomposed",
    sizes: "144x144",
    href: "/favicomatic/apple-touch-icon-144x144.png",
  },
  {
    rel: "apple-touch-icon-precomposed",
    sizes: "60x60",
    href: "/favicomatic/apple-touch-icon-60x60.png",
  },
  {
    rel: "apple-touch-icon-precomposed",
    sizes: "120x120",
    href: "/favicomatic/apple-touch-icon-120x120.png",
  },
  {
    rel: "apple-touch-icon-precomposed",
    sizes: "76x76",
    href: "/favicomatic/apple-touch-icon-76x76.png",
  },
  {
    rel: "apple-touch-icon-precomposed",
    sizes: "152x152",
    href: "/favicomatic/apple-touch-icon-152x152.png",
  },
  {
    rel: "icon",
    href: "/favicomatic/favicon-196x196.png",
    sizes: "196x196",
  },
  {
    rel: "icon",
    href: "/favicomatic/favicon-96x96.png",
    sizes: "96x96",
  },
  {
    rel: "icon",
    href: "/favicomatic/favicon-32x32.png",
    sizes: "32x32",
  },
  {
    rel: "icon",
    href: "/favicomatic/favicon-16x16.png",
    sizes: "16x16",
  },
  {
    rel: "icon",
    href: "/favicomatic/favicon-128.png",
    sizes: "128x128",
  },
];
