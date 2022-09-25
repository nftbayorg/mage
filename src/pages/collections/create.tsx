import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { Session } from "next-auth";
import CreateCollectionForm from "../../components/forms/Collection";

import { getMageAuthSession } from "../../server/common/get-server-session";
import { trpc } from "../../utils/trpc";

type PageProps = {
  session: Session
}

const CreateCollectionPage: NextPage<PageProps> = ({ session }) => {

  // const collections = trpc.useQuery(['collection.getAll']);
  const createCollection = trpc.useMutation('collection.create');

  // if (!collections.data?.length) return <div>Loading...</div>

  const handleOnSumbit = async (data: CreateCollectionFormValues) => {

    const readFiles = async (files: Array<File | undefined>) => {
      let promises = Array.from(files)
        .map(file => {
         if (file) {
            let reader = new FileReader();
            return new Promise<ArrayBuffer | string | null>(resolve => {
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(file);
            });
         }
      });
  
      // At this point you'll have an array of results
      let res = await Promise.allSettled(promises);

      return res;
    }

    const fileReaderResults = await readFiles([data.logoImageFile, data.featuredImageFile, data.bannerImageFile]);
    const determineResult = (result: PromiseSettledResult<ArrayBuffer | string | null | undefined> | undefined) => {
      if (result && result.status === 'fulfilled' && result.value) {
        return result.value.toString();
      } 

      return '';
    };


    const collection = await createCollection.mutateAsync({
      description: data.description || '',
      logoImageUrl: determineResult(fileReaderResults[0]),
      name: data.name,
      userId: session.user?.id || ''
    })
  
    console.log('New collection', collection);
  }

  return (
    <div className="p-5 mb-14 mt-14 flex items-center justify-center w-full h-full overflow-y-scroll">
    <div className="w-full md:w-1/2 md:p-4 text-2xl flex flex-col h-screen text-gray-700 font-medium dark:text-gray-300 items-start justify-center">
      <h1 className="text-5xl my-14">Create a Collection</h1>
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
