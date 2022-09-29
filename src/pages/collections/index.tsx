import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import Loading from "../../components/layout/Loading";
import { getMageAuthSession } from "../../server/common/get-server-session";
import { trpc, inferQueryOutput } from "../../utils/trpc";

type Collection = inferQueryOutput<"collection.get">;
type CollectionProps = {
  collection: Collection
}

const CollectionPanel = ({ collection }: CollectionProps) => {

  if (!collection) return <div>Unknown collection</div>
  const { logoImageUrl, name } = collection;

  return (    
    <Link href={`/collections/${collection.id}`}>
      <div>
        <div className="flex flex-col items-center justify-center w-full md:w-80 h-80 rounded-lg hover:shadow-lg hover:shadow-gray-500/50 border border-gray-200 dark:border-gray-600 cursor-pointer relative">
          {collection.logoImageUrl && 
            <div className="w-full md:w-80 h-80 relative">
            <Image
              alt="image"
              objectFit="cover"
              layout="fill"
              className="rounded-t-lg"
              src={logoImageUrl}
            />
            </div>
          }
          <div className="flex justify-start w-full p-5">
            <div className="text-md">
              {name}
            </div>
          </div>
        </div>
      </div>    
    </Link>
  )
}

const CollectionsPage: NextPage<AuthenticatedPageProps> = ({ session }) => {

  const { data, isLoading } = trpc.useQuery(['collection.getByUser', { user: session.user.id }],{
    refetchOnWindowFocus: false
  });

  return (
    <div className="p-5 mb-10 flex items-center justify-center h-full overflow-y-scroll overflow-x-hidden">
      <div className="md:p-4 text-2xl flex flex-col w-full h-screen text-gray-700 font-medium dark:text-gray-300 md:w-4/5">
        <h1 className="text-5xl my-5">My Collections</h1>
        <h2 className="text-md font-light">Create, curate, and manage collections of unique NFTs to share and sell.</h2>
        <Link href="/collections/create">
          <a className="md:max-w-fit my-10 flex items-center justify-center dark:text-gray-300 py-4 px-10 hover:bg-blue-400 bg-blue-500 rounded font-semibold disabled:bg-blue-200 text-white">
            Create a collection
          </a>
        </Link>
        {isLoading || !data ?
          <Loading/>
        :
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.map(collection => (<CollectionPanel key={collection.id} collection={collection}/>))}
          </div>
        }
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


export default CollectionsPage;
