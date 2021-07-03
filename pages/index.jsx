import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Link from "next/link";

export default function Home(props) {
  const { posts } = props;
  return (
    <div className={styles.container}>
      <Head>
        <title>Blog nextjs</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <h1> Welcome to my post</h1>
        <ul>
          {posts.map((post) => {
            console.log(posts);
            return (
              <li key={post.slug} className={styles.postitem}>
                <Link href="/post/[slug]" as={`/post/${post.slug}`}>
                  <a>{post.title}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created By Branislav Pavkovic
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

const getPost = async () => {
  const res = await fetch(
    `${process.env.API__URL}/ghost/api/v3/content/posts/?key=${process.env.Content__API__Key}&fields=title,slug,custom_excerpt`
  ).then((res) => res.json());
  const posts = res.posts;
  return posts;
};

export const getStaticProps = async ({ params }) => {
  const posts = await getPost();
  return {
    props: { posts },
  };
};