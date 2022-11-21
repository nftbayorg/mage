// src/pages/_app.tsx
import "../styles/globals.css";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Layout from "../components/layout/Layout";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Analytics } from '@vercel/analytics/react';

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => {

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Layout>
          <Component {...pageProps} />
          <Analytics />
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
