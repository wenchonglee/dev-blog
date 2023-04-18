import { PostPreview } from "components/PostPreview";
import dayjs from "dayjs";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Post, getPosts } from "./api/posts";

type Homepage = NextPage<{ posts: Post[] }>;

const Home: Homepage = (props) => {
  const { posts } = props;

  return (
    <div>
      <Head>
        <title>Wen Chong</title>
        <meta name="title" content="Wen Chong" />
        <meta name="description" content="Wen Chong's site. Software Engineer specialized in React & Typescript." />
        <meta property="og:image" content="/favicon.ico" key="og:image" />
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
    props: {
      posts: posts.sort((a, b) => {
        if (a && b) {
          return (
            dayjs(b.data.publishedOn, "DD MMM YYYY").valueOf() - dayjs(a.data.publishedOn, "DD MMM YYYY").valueOf()
          );
        }
        return 0;
      }),
    },
  };
};
