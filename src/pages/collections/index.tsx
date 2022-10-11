import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest, NextApiResponse, NextPage } from "next";
import Link from "next/link";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";
import { CollectionPanel } from "../../components/views/collections/CollectionPanel";

const CollectionsPage: NextPage<AuthenticatedPageProps> = ({ session }) => {
  let { data } = trpc.collection.getByUser.useQuery(
    { user: session.user.id },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (!data) {
    data = Array(6);
  }

  return (
    <div className="p-5 mb-10 flex items-center justify-center h-full overflow-y-scroll overflow-x-hidden">
      <div className="md:p-4 text-2xl flex flex-col w-full h-screen text-gray-700 font-medium dark:text-gray-300 md:w-4/5">
        <h1 className="text-3xl md:text-5xl my-5">My Collections</h1>
        <h2 className="md:text-md font-light">
          Create, curate, and manage collections of unique NFTs to share and
          sell.
        </h2>
        <Link href="/collections/create">
          <a
            className="
            md:max-w-fit my-10 
            flex items-center justify-center 
            dark:text-gray-300 py-4 px-10 hover:bg-blue-400 bg-blue-500 disabled:bg-blue-200 text-white
            dark:border
            dark:border-gray-300
            dark:bg-white dark:bg-opacity-0
            dark:hover:bg-opacity-10
            rounded
            font-semibold 
          "
          >
            Create a collection
          </a>
        </Link>
        {data && data.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((collection, idx) => (
              <CollectionPanel key={idx} collection={collection} />
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
