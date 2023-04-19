import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { CollectionPanel } from "../../components/views/collections/CollectionPanel";
import { prisma } from "../../server/db/client";
import { Collection } from "prisma/prisma-client";

const ExploreCollectionsPage: NextPage<AuthenticatedPageProps> = ({ collections }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const data = collections as Collection[];

  return (
    <div className="px-4 py-5 md:px-5 mb-10 flex items-center justify-center h-full overflow-auto overflow-x-hidden">
      <div className="md:p-4 text-2xl flex flex-col w-full h-fit-content text-gray-700 font-medium dark:text-gray-200 md:w-11/12">
        <h1 className="text-3xl md:text-5xl my-5 md:my-10">Explore Collections</h1>
        {data && data.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {data.map((collection) => (
              <CollectionPanel key={collection.id} collection={collection} />
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

  const collections = await prisma.collection.findMany({
    where: {
      visible: true
    }
  });

  return {
    props: {
      collections: collections as Collection[]
    },
  };
};

export default ExploreCollectionsPage;
