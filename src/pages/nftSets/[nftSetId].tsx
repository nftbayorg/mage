import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import NftSetDetail from "../../components/views/nfts/nftSetDetail";
import { prisma } from "../../server/db/client";
import { NFTSet } from "prisma/prisma-client";

const NftSetDetailPage: NextPage = ({ nftSet }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-350px)]">
      <NftSetDetail nftSet={nftSet} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {

  const nftSet = await prisma.nFTSet.findFirst({
    where: {
      id: ctx.params?.nftSetId as string || '',
    },
    include: {
      collection: true,
      nftEditions: true,
      properties: true
    },
  });

  return {
    props: {
      nftSet: JSON.parse(JSON.stringify(nftSet)) as NFTSet
    },
  };
};

export default NftSetDetailPage;
