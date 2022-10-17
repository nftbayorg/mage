// src/pages/_app.tsx
import "../styles/globals.css";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "../utils/trpc";
import Layout from "../components/layout/Layout";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => {

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
