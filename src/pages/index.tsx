import { NextPage, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { CollectionPanel } from "../components/views/collections/CollectionPanel";
import { useCallback, useEffect, useState } from "react";
import { prisma } from "../server/db/client";

const Home: NextPage = ({ collections }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [sortedData, setSortedData] = useState<[] | undefined>(undefined);

  const setData = useCallback((unsortedData: [] | undefined) => {
    if (!unsortedData) return unsortedData;
    setSortedData(unsortedData.sort(() => .5 - Math.random()));
    return ;
  }, []);

  const getCollectibles = () => {
    return sortedData?.slice(4, 8) || [];
  }

  const getNewAndNoteable = useCallback(() => {
    return sortedData?.slice(0,4) || [];
  }, [sortedData])

  useEffect(() => {
    if (collections) {
      setData(collections as []);
    }
  }, [collections, setData])

  return (
    <div className="my-10">
      <Head>
        <title>Mage</title>
        <meta name="description" content="NFT DeFi Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col md:gap-5 items-center justify-center min-h-[calc(100vh-350px)] p-4 mx-auto dark:text-gray-300 text-2xl text-gray-700 md:min-w-[calc(83%)]">
        <h1 className="text-3xl md:text-6xl lg:text-[5rem] leading-normal font-extrabold">
          Trade and stake NFTs
        </h1>
        <p>DeFi Trading Platform</p>
        <div className="flex flex-col items-start justify-center w-full pt-10 md:pt-6 text-2xl">
          <div className="text-3xl md:text-4xl text-gr">New and noteable</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-h-[740px] md:max-h-[430px] 2xl:max-h-fit gap-x-2 gap-y-10 justify-center w-full pt-6 text-2xl overflow-hidden">
            {sortedData && getNewAndNoteable().map((collection, idx) => {
              return <CollectionPanel key={idx} collection={collection} />;
            })}
          </div>
        </div>
        <div className="flex flex-col items-start justify-center w-full pt-6 text-2xl">
          <div className="text-3xl md:text-4xl">Collectibles</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-h-[740px] md:max-h-[430px] 2xl:max-h-fit gap-x-2 gap-y-10 justify-center w-full pt-6 text-2xl overflow-hidden">
            {getCollectibles().map((collection, idx) => {
              return <CollectionPanel key={idx} collection={collection} />;
            })}
          </div>
        </div>
      </main>
    </div>
  );
};


export const getStaticProps: GetStaticProps = async () => {
  const collections = await prisma.collection.findMany({
    where: {
      visible: true
    }
  });

  return {
    props: {
      collections: JSON.parse(JSON.stringify(collections))
    },
  };
};


export default Home;
