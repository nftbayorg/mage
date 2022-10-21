import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { prisma } from "../../server/db/client";
import { NFTSet } from "prisma/prisma-client";
import NftSetSummary from "../../components/views/nfts/nftSetSummary";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

type NFTSetWithLeanCollection = NFTSet & {
  collection: {
    name: string;
    verified: boolean;
  }
}

const FavoritesPage: NextPage<AuthenticatedPageProps> = ({ favorites }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  return (
    <div className="p-5 mb-10 flex items-center justify-center h-full overflow-y-scroll overflow-x-hidden">
      <div className="md:p-4 text-2xl flex flex-col w-full h-screen text-gray-700 font-medium dark:text-gray-200 md:w-4/5">
        <h1 className="text-3xl md:text-5xl my-5">Favorited</h1>
        {favorites && favorites.length && (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {favorites.map((nft) => (
              <NftSetSummary key={nft.id} nftSet={nft} collectionName={nft.collection?.name} verified={nft.collection?.verified}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: { destination: "/login", permanent: false },
      props: {},
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user?.id
    }
  });

  let favorites;

  if (user) {

    favorites = await prisma.nFTSet.findMany({
      where: {
        id: {
          in: user.liked
        }
      },
      include: {
        collection: {
          select: {
            name: true,
            verified: true
          }
        }
      }
    });
  }

  return {
    props: {
      favorites: favorites as NFTSetWithLeanCollection[]
    },
  };
};

export default FavoritesPage;
