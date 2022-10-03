import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { Session } from "next-auth";
import CreateItem from "../../components/forms/Nft";
import { getMageAuthSession } from "../../server/common/get-server-session";
import { trpc } from "../../utils/trpc";

type PageProps = {
  session: Session
}

const CreateNftPage: NextPage<PageProps> = ({ session }) => {

  // const collections = trpc.useQuery(['collection.getAll']);
  const createNftSet = trpc.useMutation('nftSet.create');

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

    let res = await Promise.allSettled(promises);

    return res;
  }

  const determineResult = (result: PromiseSettledResult<ArrayBuffer | string | null | undefined> | undefined) => {
    if (result && result.status === 'fulfilled' && result.value) {
      return result.value.toString();
    } 

    return '';
  };

  const handleOnSumbit = async (data: CreateItemFormValues) => {
    const fileReaderResults = await readFiles([data.file]);
    const nftSet = await createNftSet.mutateAsync({
      creator: session.user?.id || '',
      // collectionId: collections.data[0]?.id,
      file: determineResult(fileReaderResults[0]),
      description: data.description,
      name: data.name,
      totalSupply: data.totalSupply,
      link: data.link,
    });

    console.log('nft', nftSet);
    
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

export default CreateNftPage;
