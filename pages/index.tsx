import { PostPreview } from "components/PostPreview";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { getPosts, Post } from "./api/posts";

type Homepage = NextPage<{ posts: Post[] }>;

const Home: Homepage = (props) => {
  const { posts } = props;

  return (
    <div>
      <Head>
        <title>Wen Chong</title>
        <meta name="title" content="Wen Chong" />
        <meta name="description" content="Wen Chong's site. Software Engineer specialized in React & Typescript." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="post-list">
        {posts.map((post, index) => {
          return <PostPreview key={index} post={post} />;
        })}
      </div>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const posts = getPosts();

  return {
    props: { posts },
  };
};
