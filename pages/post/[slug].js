import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.scss";
import { useState } from "react";
import Image from "next/image";

const { API__URL, Content__API__Key } = process.env;

async function getPost(slug) {
  const res = await fetch(
    `${API__URL}/ghost/api/v3/content/posts/slug/${slug}?key=${Content__API__Key}&fields=title,slug,html`
  ).then((res) => res.json());

  const posts = res.posts;

  return posts[0];
}

// Ghost CMS Request
export const getStaticProps = async ({ params }) => {
  const post = await getPost(params.slug);
  return {
    props: { post },
    revalidate: 10,
  };
};

// hello-world - on first request = Ghost CMS call is made (1)
// hello-world - on other requests ... = filesystem is called (1M)

export const getStaticPaths = () => {
  // paths -> slugs which are allowed
  // fallback ->
  return {
    paths: [],
    fallback: true,
  };
};

const Post = (props) => {
  const { post } = props;
  const [enableLoadComments, setEnableLoadComments] = useState(true);

  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  function loadComments() {
    setEnableLoadComments(false);
    const disqus_config = function () {
      this.page.url = window.location.href;
      this.page.identifier = post.slug;
    };

    const script = document.createElement("script");
    script.src = "https://ghostcms-nextjs.disqus.com/embed.js";
    script.setAttribute("data-timestamp", Date.now().toString());

    document.body.appendChild(script);
  }

  return (
    <div className={styles.container}>
      <p className={styles.goback}>
        <Link href="/">
          <a>Go back</a>
        </Link>
      </p>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }}></div>

      {enableLoadComments && (
        <p className={styles.goback} onClick={loadComments}>
          Load Comments
        </p>
      )}

      <div id="disqus_thread"></div>
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
};

export default Post;
