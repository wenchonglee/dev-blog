import type { AppProps } from "next/app";
import Image from "next/image";
import Link from "next/link";
import Avatar from "../public/avatar.svg";
import "../styles/globals.css";

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <div className="main-container">
      <Link href="/">
        <a className="header">
          <Image className="header-avatar" src={Avatar} alt="Avatar" width={100} height={100} />

          <h1>Wen Chong</h1>
        </a>
      </Link>

      <div className="nav-links">
        {/* <Link href="/about">
          <a>About</a>
        </Link> */}

        <a href="https://github.com/wenchonglee" target="_blank" rel="noopener noreferrer">
          <Image src="/Github.png" alt="Github Icon" width={24} height={24} />
        </a>
      </div>

      <Component {...pageProps} />
    </div>
  );
}

export default App;
