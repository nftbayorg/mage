import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { CollectionPanel } from "../components/views/collections/CollectionPanel";
import { useEffect, useRef, useState } from "react";

const Home: NextPage = () => {
  const [sorted, setSorted] = useState(false);
  const collections = trpc.collection.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const dataRef = useRef(collections.data);

  if (!dataRef.current) {
    dataRef.current = Array(6);
  }

  useEffect(() => {
    if (dataRef.current) {
      dataRef.current.sort(() => Math.random() - Math.random());
      setSorted(true);
    }
  }, [])

  if (!sorted) <></>

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
            {[dataRef.current[0], dataRef.current[1], dataRef.current[2]].map((collection, idx) => {
              return <CollectionPanel key={idx} collection={collection} />;
            })}
          </div>
        </div>
        <div className="flex flex-col items-start justify-center w-full md:pt-6 text-2xl">
          <div className="text-3xl md:text-4xl">Collectibles</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-h-96 gap-x-2 gap-y-10 justify-center w-full pt-6 text-2xl overflow-hidden">
            {[dataRef.current[3], dataRef.current[4], dataRef.current[5]].map((collection, idx) => {
              return <CollectionPanel key={idx} collection={collection} />;
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
