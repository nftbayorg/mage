import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { getMageAuthSession } from "../../server/common/get-server-session";
import { trpc } from "../../utils/trpc";

const Collections: NextPage<AuthenticatedPageProps> = ({ session }) => {

  const collections = trpc.useQuery(['collection.getByUser', { user: session.user.id }]);

  if (!collections) return <div>Loading...</div>

  return (
    <div className="p-5 mb-10 flex items-center justify-center w-full h-full overflow-y-scroll">
      <div className="md:p-4 text-2xl flex flex-col h-screen text-gray-700 font-medium dark:text-gray-300">
        <h1 className="text-4xl my-5">My Collections</h1>
        {collections.data?.map(collection => (<div key={collection.id}>{collection.name}</div>))}
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

