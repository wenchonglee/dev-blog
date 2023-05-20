import Link from "next/link";
import { Post } from "pages/api/posts";
import { Exhibits } from "../Exhibit";
import styles from "./styles.module.css";

type PostPreviewProps = {
  post: Post;
};

export const PostPreview = (props: PostPreviewProps) => {
  const { post } = props;
  const { slug, data } = post;
  const { title, excerpt, exhibit, publishedOn } = data;

  const Exhibit = Exhibits[exhibit as keyof typeof Exhibits];

  return (
    <Link href={`/posts/${slug}`} className={styles.container}>
      <div>
        <Exhibit />
      </div>

      <div className={styles.content}>
        <small>{publishedOn}</small>
        <h3>{title}</h3>
        <p>{excerpt}</p>
      </div>
    </Link>
  );
};
