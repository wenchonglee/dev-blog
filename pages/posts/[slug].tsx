import fs from "fs";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { rehypePlugins } from "next.config.mjs";
import Head from "next/head";
import path from "path";
import { getPost } from "../api/posts";

const DATA_DIR = "data";

const Blog = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { post } = props;

  return (
    <>
      <Head>
        <title>{post.data.title}</title>
        <meta property="title" content={post.data.title} key="title" />
        <meta property="description" content={post.data.excerpt} key="description" />
      </Head>
    </>
  );
};

export async function getStaticPaths() {
  const dirFiles = fs.readdirSync(path.join(process.cwd(), DATA_DIR), {
    withFileTypes: true,
  });

  const paths = dirFiles.map((file) => {
    if (!file.name.endsWith(".mdx")) return;
    const filename = path.parse(file.name).name;

    return `/posts/${filename}`;
  });

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps = async (props: GetStaticPropsContext<{ slug: string }>) => {
  const { params } = props;
  const post = getPost(params!.slug);

  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: rehypePlugins as any,
    },
  });

  return {
    props: {
      post: { ...post, mdxSource },
    },
  };
};

export default Blog;
