/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || "https://wenchonglee.dev",
  generateIndexSitemap: false,
};

export default config;
