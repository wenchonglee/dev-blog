import type { AppProps } from "next/app";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";
import * as gtag from "../lib/gtag";
import Avatar from "../public/avatar.svg";
import "../styles/globals.css";

function App(props: AppProps) {
  const { Component, pageProps } = props;
  const { pathname, events } = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };

    events.on("routeChangeComplete", handleRouteChange);
    events.on("hashChangeComplete", handleRouteChange);
    return () => {
      events.off("routeChangeComplete", handleRouteChange);
      events.off("hashChangeComplete", handleRouteChange);
    };
  }, [events]);

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      <div className="main-container">
        <div className="header-container">
          <Link href="/" className="header">
            <Image className="header-avatar" src={Avatar} alt="Avatar" width={100} height={100} priority />
            <h1>Wen Chong</h1>
          </Link>
        </div>

        <div className="nav-container">
          <div className="nav-links">
            <Link href="/" className={pathname === "/" ? "nav-active" : ""}>
              Posts
            </Link>
            <Link href="/projects" className={pathname === "/projects" ? "nav-active" : ""}>
              Projects
            </Link>
            <Link href="/about" className={pathname === "/about" ? "nav-active" : ""}>
              About
            </Link>
          </div>

          <a href="https://github.com/wenchonglee" target="_blank" rel="noopener noreferrer">
            <Image src="/GitHub.png" alt="Github Icon" width={24} height={24} />
          </a>
        </div>

        <div>
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}

export default App;
