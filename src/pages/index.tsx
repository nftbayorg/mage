import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { getMageAuthSession } from "../server/common/get-server-session";
import dynamic from "next/dynamic";

const SetTheme = dynamic(() => import("../components/layout/SetTheme"), { ssr: false });

const Home: NextPage = () => {

  const { data } = useSession();

  return (
    <>
      <Head>
        <title>Mage</title>
        <meta name="description" content="NFT DeFi Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
        <h1 className="dark:text-gray-300 text-3xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Trade and stake NFTs
        </h1>
        <p className="dark:text-gray-300 text-2xl text-gray-700">
          DeFi Trading Platform
        </p>
        <div className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-2 lg:w-2/3"></div>
        <div className="flex items-center justify-center w-full pt-6 text-2xl text-blue-500">
          {data?.user?.name ? (
            <p>Hello, {data?.user?.name}!</p>
          ) : (
            <p>Loading..</p>
          )}
        </div>
        <SetTheme/>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getMageAuthSession(ctx);

  // if (!session) {
  //   return {
  //     redirect: { destination: "/login", permanent: false },
  //     props: {},
  //   };
  // }

  return {
    props: {
      session,
    },
  };
};

export default Home;
