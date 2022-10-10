import type {
  NextPage,
} from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { CollectionPanel } from "../components/views/collections/CollectionPanel";

const Home: NextPage = () => {

  const collections = trpc.proxy.collection.getAll.useQuery();
  const { data } = collections;

  return (
    <div className="my-10">
      <Head>
        <title>Mage</title>
        <meta name="description" content="NFT DeFi Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col gap-5 items-center justify-center min-h-[calc(100vh-350px)] p-4 mx-auto dark:text-gray-300 text-2xl text-gray-700">
        <h1 className="text-3xl md:text-6xl lg:text-[5rem] leading-normal font-extrabold">
          Trade and stake NFTs
        </h1>
        <p>
          DeFi Trading Platform
        </p>
        <div className="flex flex-col items-start justify-center w-full pt-6 text-2xl">
          <div className="text-4xl text-gr">New and noteable</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-h-96 gap-x-2 gap-y-10 justify-center w-full pt-6 text-2xl overflow-hidden">
            {data && [data[0], data[1], data[2]].map(collection => {
              return collection && (
                <CollectionPanel
                  key={collection.id} 
                  collectionId={collection.id}
                  featuredImageUrl={collection.featureImageUrl}
                  logoImageUrl={collection.logoImageUrl}
                  name={collection.name}
                />
                )
              })}
          </div>
        </div>
        <div className="flex flex-col items-start justify-center w-full pt-6 text-2xl">
          <div className="text-4xl">Collectibles</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-h-96 gap-x-2 gap-y-10 justify-center w-full pt-6 text-2xl overflow-hidden">
            {data && [data[3], data[4], data[5]].map(collection => {
              return collection && (
                <CollectionPanel
                  key={collection.id} 
                  collectionId={collection.id}
                  featuredImageUrl={collection.featureImageUrl}
                  logoImageUrl={collection.logoImageUrl}
                  name={collection.name}
                  />
                )
              })}
          </div>
        </div>
      </main>
    </div>
  );
};


export default Home;
