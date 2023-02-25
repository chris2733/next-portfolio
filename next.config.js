/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // false for dev, true for prod
  swcMinify: true,
  i18n: {
    locales: ["en-GB", "en-US"],
    defaultLocale: "en-GB",
  },
};

module.exports = nextConfig;
