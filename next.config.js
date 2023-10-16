/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // false for dev, true for prod
  swcMinify: true,
  i18n: {
    locales: ["en-GB", "en-US"],
    defaultLocale: "en-GB",
  },
  // experimental - not sure if this is effective
  // webpack: (config) => {
  //   config.externals = [...config.externals, { canvas: "canvas" }]; // required to make canvas work without glitching
  //   return config;
  // },
};

module.exports = nextConfig;
