import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import Loading from "../../components/layout/Loading";
import { getMageAuthSession } from "../../server/common/get-server-session";
import { trpc, inferQueryOutput } from "../../utils/trpc";
import Image from "../../components/forms/controls/Image";
import { CollectionPanel } from "../../components/views/collections/CollectionPanel";

const CollectionsPage: NextPage<AuthenticatedPageProps> = ({ session }) => {

  const { data, isLoading } = trpc.useQuery(['collection.getByUser', { user: session.user.id }],{
    refetchOnWindowFocus: false
  });

  return (
    <div className="p-5 mb-10 flex items-center justify-center h-full overflow-y-scroll overflow-x-hidden">
      <div className="md:p-4 text-2xl flex flex-col w-full h-screen text-gray-700 font-medium dark:text-gray-300 md:w-4/5">
        <h1 className="text-3xl md:text-5xl my-5">My Collections</h1>
        <h2 className="md:text-md font-light">Create, curate, and manage collections of unique NFTs to share and sell.</h2>
        <Link href="/collections/create">
          <a className="md:max-w-fit my-10 flex items-center justify-center dark:text-gray-300 py-4 px-10 hover:bg-blue-400 bg-blue-500 rounded font-semibold disabled:bg-blue-200 text-white">
            Create a collection
          </a>
        </Link>
        {isLoading || !data ?
          <Loading/>
        :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

