import { Codesandbox } from "components/Codesandbox";
import { Exhibits } from "components/Exhibit";
import * as ExhibitComponents from "components/Exhibit/Squiggle";
import fs from "fs";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { rehypePlugins, remarkPlugins } from "next.config.mjs";
import Head from "next/head";
import path from "path";
import { getPost } from "../api/posts";

const DATA_DIR = "data";

const Blog = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { post } = props;

  const Exhibit = Exhibits[post.data.exhibit as keyof typeof Exhibits];

  return (
    <>
      <Head>
        <title>{post.data.title}</title>
        <meta property="title" content={post.data.title} key="title" />
        <meta property="description" content={post.data.excerpt} key="description" />
      </Head>

      <br />
      <Exhibit />
      <br />
      <small>{post.data.publishedOn}</small>

      <div className="mdx-container">
        <MDXRemote {...post.mdxSource} components={{ ...ExhibitComponents, Codesandbox }} />
      </div>
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
      remarkPlugins: remarkPlugins as any,
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
