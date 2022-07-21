/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || "https://wenchonglee.dev",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
};

export default config;
