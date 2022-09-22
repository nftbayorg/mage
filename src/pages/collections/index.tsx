import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { getMageAuthSession } from "../../server/common/get-server-session";
import { trpc, inferQueryOutput } from "../../utils/trpc";

type Collection = inferQueryOutput<"collection.get">;
type CollectionProps = {
  collection: Collection
}

const CollectionPanel = ({ collection }: CollectionProps) => {

  if (!collection) return <div>Unknown collection</div>

  return (    
    <Link href={`/collections/${collection.id}`}>
      <div className="flex-col hover:shadow-lg hover:shadow-gray-500/50 rounded border border-gray-200 dark:border-gray-600 cursor-pointer">
        <div className="border-t border-gray-200 dark:border-gray-600 p-4">
          <div className="text-md">
            {collection.name}
          </div>
          <div className="m-5 text-sm text-gray-700 dark:text-white">
            {collection.description}
          </div>
        </div>
      </div>
    </Link>
  )
}

const Collections: NextPage<AuthenticatedPageProps> = ({ session }) => {

  const collections = trpc.useQuery(['collection.getByUser', { user: session.user.id }],{
    refetchOnWindowFocus: false
  });

  if (!collections) return <div>Loading...</div>

  return (
    <div className="p-5 mb-10 flex items-center justify-center w-full h-full overflow-y-scroll">
      <div className="md:p-4 text-2xl flex flex-col h-screen text-gray-700 font-medium dark:text-gray-300">
        <h1 className="text-4xl my-5">My Collections</h1>
        <div className="flex flex-col md:flex-row gap-2">
          {collections.data?.map(collection => (<CollectionPanel key={collection.id} collection={collection}/>))}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getMageAuthSession(ctx);

  if (!session) {
    return {
      redirect: { destination: "/", permanent: false },
      props: {},
    };
  }

  return {
    props: {
      session,
    },
  };
};


export default Collections;

