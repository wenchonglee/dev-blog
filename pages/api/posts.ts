import fs from "fs";
import matter from "gray-matter";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export type Post = {
  data: Record<string, any>;
  content: string;
  slug: string;
};

const DATA_DIR = "data";
export const getPosts = () => {
  const dirFiles = fs.readdirSync(path.join(process.cwd(), DATA_DIR), {
    withFileTypes: true,
  });

  const posts = dirFiles.map((file) => {
    if (!file.name.endsWith(".mdx")) return;

    const fileContent = fs.readFileSync(path.join(process.cwd(), DATA_DIR, file.name), "utf-8");
    const { data, content } = matter(fileContent);

    const slug = file.name.replace(/.mdx$/, "");
    return { data, content, slug };
  });

  return posts;
};

export const getPost = (slug: string) => {
  const filename = `${slug}.mdx`;
  const fileContent = fs.readFileSync(path.join(process.cwd(), DATA_DIR, filename), "utf-8");
  const { data, content } = matter(fileContent);

  return { data, content, slug };
};

export default function handler(req: NextApiRequest, res: NextApiResponse<(Post | undefined)[]>) {
  const posts = getPosts();

  res.status(200).json(posts);
}
