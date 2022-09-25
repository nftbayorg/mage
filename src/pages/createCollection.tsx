import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { Session } from "next-auth";
import CreateCollectionForm from "../components/forms/Collection";

import { getMageAuthSession } from "../server/common/get-server-session";
import { trpc } from "../utils/trpc";

type PageProps = {
  session: Session
}

const CreateCollectionPage: NextPage<PageProps> = ({ session }) => {

  // const collections = trpc.useQuery(['collection.getAll']);
  const createNftSet = trpc.useMutation('nftSet.create');

  // if (!collections.data?.length) return <div>Loading...</div>

  const handleOnSumbit = async (data: CreateItemFormValues) => {
    let reader = new FileReader();
    reader.readAsDataURL(data.file);
    reader.onload = async function () {
    //   const nftSet = await createNftSet.mutateAsync({
    //     creator: session.user?.id || '',
    //     // collectionId: collections.data[0]?.id,
    //     file: reader.result?.toString() || '',
    //     description: data.description,
    //     name: data.name,
    //     totalSupply: data.totalSupply,
    //     link: data.link,
    //   });

    };
    
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  return (
    <div className="p-5 mb-10 flex items-center justify-center w-full h-full overflow-y-scroll">
    <div className="w-full md:w-4/5 md:p-4 text-2xl flex flex-col h-screen text-gray-700 font-medium dark:text-gray-300 items-center justify-center">
      <h1 className="text-4xl my-5">Create New Item</h1>
      <CreateCollectionForm onSubmit={handleOnSumbit}/>
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

export default CreateCollectionPage;
