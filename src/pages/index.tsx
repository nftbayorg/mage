import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { CollectionPanel } from "../components/views/collections/CollectionPanel";
import { useMemo } from "react";

const Home: NextPage = () => {
  const collections = trpc.collection.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  let { data } = collections;

  if (!data) {
    data = Array(6);
  } else {
    data.sort(() => Math.random() - Math.random());
  }

  return (
    <div className="my-10">
      <Head>
        <title>Mage</title>
        <meta name="description" content="NFT DeFi Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col md:gap-5 items-center justify-center min-h-[calc(100vh-350px)] p-4 mx-auto dark:text-gray-300 text-2xl text-gray-700">
        <h1 className="text-3xl md:text-6xl lg:text-[5rem] leading-normal font-extrabold">
          Trade and stake NFTs
        </h1>
        <p>DeFi Trading Platform</p>
        <div className="flex flex-col items-start justify-center w-full pt-10 md:pt-6 text-2xl">
          <div className="text-3xl md:text-4xl text-gr">New and noteable</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-h-96 gap-x-2 gap-y-10 justify-center w-full pt-6 text-2xl overflow-hidden">
            {[data[0], data[1], data[2]].map((collection, idx) => {
              return <CollectionPanel key={idx} collection={collection} />;
            })}
          </div>
        </div>
        <div className="flex flex-col items-start justify-center w-full md:pt-6 text-2xl">
          <div className="text-3xl md:text-4xl">Collectibles</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-h-96 gap-x-2 gap-y-10 justify-center w-full pt-6 text-2xl overflow-hidden">
            {[data[3], data[4], data[5]].map((collection, idx) => {
              return <CollectionPanel key={idx} collection={collection} />;
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
