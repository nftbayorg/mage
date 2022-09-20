import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { Session } from "next-auth";
import CreateItem from "../../components/CreateItem";
import { getMageAuthSession } from "../../server/common/get-server-session";
import { trpc } from "../../utils/trpc";

type PageProps = {
  session: Session
}

const Create: NextPage<PageProps> = ({ session }) => {

  const collections = trpc.useQuery(['collection.getAll']);
  const createNftSet = trpc.useMutation('nftSet.create');
  const createNftEdition = trpc.useMutation('nftEdition.create');

  if (!collections.data?.length) return <div>Loading...</div>

  const handleOnSumbit = async (data: CreateItemFormValues) => {
    const nftSet = await createNftSet.mutateAsync({
      collectionId: collections.data[0]?.id || '',
      name: data.name,
    });

    await createNftEdition.mutateAsync({
      name: data.name,
      nftSetId: nftSet.id,
      url: '',
      ownerId: ''
    })
  }

  return (
    <div className="p-5 mb-10 flex items-center justify-center w-full h-full overflow-y-scroll">
      <div className="md:p-4 text-2xl flex flex-col h-screen text-gray-700 font-medium dark:text-gray-300">
        <h1 className="text-4xl my-5">Create New Item</h1>
        <CreateItem onSubmit={handleOnSumbit}/>
      </div>
    </div>
  );
};

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

export default Create;
