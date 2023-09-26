import "../styles/globals.css";
import Layout from "../components/layout";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Router from "next/router";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [loading, setLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false); // 新しいステートを追加

  useEffect(() => {
    const start = () => {
      setFadeOut(false);
      setLoading(true);
    };

    const end = () => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 300);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        {loading && <LoadingScreen fadeOut={fadeOut} />}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </SessionProvider>
  );
}
function LoadingScreen({ fadeOut }) {
  return (
    <div className={`loadingScreen ${fadeOut ? "fade-out" : "fade-in"}`}>
      <div>
        <lottie-player
          src="/images/loading.json"
          background="transparent"
          speed="1"
          loop
          autoplay
        ></lottie-player>
      </div>
    </div>
  );
}
export default MyApp;
