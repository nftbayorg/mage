import superjson from 'superjson';
import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { Collection } from "prisma/prisma-client";
import { prisma } from "../../server/db/client";
import CollectionDetail from "../../components/views/collections/CollectionDetail";

const CollectionDetailPage: NextPage = ({ collection }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <CollectionDetail collection={collection} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {

  const collection = await prisma.collection.findFirst({
    where: {
      id: ctx.params?.collectionId as string || '',
      visible: true
    },
    include: {
      nftSets: true,
    },
  });

  return {
    props: {
      collection: collection as Collection
    },
  };
};

export default CollectionDetailPage;
