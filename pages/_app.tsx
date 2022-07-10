import type { AppProps } from "next/app";
import Image from "next/future/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Avatar from "../public/avatar.svg";
import "../styles/globals.css";

function App(props: AppProps) {
  const { Component, pageProps } = props;
  const { pathname } = useRouter();

  return (
    <div className="main-container">
      <div className="header-container">
        <Link href="/">
          <a className="header">
            <Image className="header-avatar" src={Avatar} alt="Avatar" width={100} height={100} />
            <h1>Wen Chong</h1>
          </a>
        </Link>
      </div>

      <div className="nav-container">
        <div className="nav-links">
          <Link href="/">
            <a className={pathname === "/" ? "nav-active" : ""}>Posts</a>
          </Link>
          <Link href="/about">
            <a className={pathname === "/about" ? "nav-active" : ""}>About</a>
          </Link>
          {/* <Link href="/projects">
            <a>Projects</a>
          </Link> */}
        </div>

        <a href="https://github.com/wenchonglee" target="_blank" rel="noopener noreferrer">
          <Image src="/GitHub.png" alt="Github Icon" width={24} height={24} />
        </a>
      </div>

      <div>
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default App;
