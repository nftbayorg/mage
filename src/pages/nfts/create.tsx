import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaCheck, FaRedo } from "react-icons/fa";
import CreateItem from "../../components/forms/Nft";
import { getMageAuthSession } from "../../server/common/get-server-session";
import { trpc } from "../../utils/trpc";

type PageProps = {
  session: Session
}

const CreateNftPage: NextPage<PageProps> = ({ session }) => {

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nftSetCreated, setNftSetCreated] = useState(false);

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
    setIsSubmitting(true);

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

    setNftSetCreated(true);

    router.push("/collections");    
  }

  return (
    <div className="p-5 mb-10 flex items-center justify-center w-full h-full overflow-y-scroll">
      {isSubmitting ?
        <div className="w-full md:w-1/2 md:p-4 text-2xl flex flex-col h-[calc(100vh-490px)] text-gray-700 font-medium dark:text-gray-300 items-start justify-center">
          <div className="flex flex-col text-xl md:text-2xl gap-5 h-full w-full justify-start">
            <div className="text-2xl md:text-4xl">Creating your collection</div>
            <div className="flex items-center gap-5 w-full h-16 border-2 rounded-lg p-5 md:p-10">
              {!nftSetCreated && <FaRedo className="animate-spin fill-red-500"/>}
              {nftSetCreated && <FaCheck className="fill-green-500"/>}
              <div>Uploading image</div>
            </div>
            <div className="flex items-center gap-5 w-full h-16 border-2 rounded-lg p-5 md:p-10">
              {!nftSetCreated && <FaRedo className="animate-spin fill-red-500"/>}
              {nftSetCreated && <FaCheck className="fill-green-500"/>}
              <div>Nft set created</div>
            </div>
          </div>
        </div>
      :
        <>
          <div className="md:p-4 text-2xl flex flex-col h-screen text-gray-700 font-medium dark:text-gray-300">
            <h1 className="text-4xl my-5">Create New Item</h1>
            <CreateItem onSubmit={handleOnSumbit}/>
          </div>
        </>
      }
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
