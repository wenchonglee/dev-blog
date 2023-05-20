import nextMdx from "@next/mdx";
import fs from "fs";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const rehypePrettyCodeOptions = {
  theme: JSON.parse(fs.readFileSync("./gruvbox.json"), "utf-8"),
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className.push("highlighted");
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ["word"];
  },
  tokensMap: {},
};

export const rehypePlugins = [[rehypePrettyCode, rehypePrettyCodeOptions]];
export const remarkPlugins = [remarkGfm];

const withMDX = nextMdx({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "@mdx-js/react",
    remarkPlugins,
    rehypePlugins,
  },
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

export default withMDX(nextConfig);
