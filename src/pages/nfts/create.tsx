import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import { useMemo, useState } from "react";
import { FaCheck, FaRedo } from "react-icons/fa";
import CreateItem from "../../components/forms/Nft";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";
import { prisma } from "../../server/db/client";
import { Collection } from "prisma/prisma-client";

type CreateNftPageProps = {
  session: Session,
  collections: Collection[]
}

const CreateNftPage: NextPage<CreateNftPageProps> = ({ session, collections }: CreateNftPageProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nftSetCreated, setNftSetCreated] = useState(false);

  const { collectionId } = router.query;

  const collection = useMemo(() => collections.find(collection => collection.id === collectionId), [collectionId, collections]);

  const createNftSet = trpc.nftSet.create.useMutation();

  const readFiles = async (files: Array<File | undefined>) => {
    let promises = Array.from(files).map((file) => {
      if (file) {
        let reader = new FileReader();
        return new Promise<ArrayBuffer | string | null>((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }
    });

    let res = await Promise.allSettled(promises);

    return res;
  };

  const determineResult = (
    result:
      | PromiseSettledResult<ArrayBuffer | string | null | undefined>
      | undefined
  ) => {
    if (result && result.status === "fulfilled" && result.value) {
      return result.value.toString();
    }

    return "";
  };

  const handleOnSumbit = async (data: CreateItemFormValues) => {
    setIsSubmitting(true);

    const hasCollection = data.collectionId
      ? { collectionId: data.collectionId }
      : {};

    const fileReaderResults = await readFiles([data.file]);
    const nftSet = await createNftSet.mutateAsync({
      creator: session.user?.id || "",
      file: determineResult(fileReaderResults[0]),
      description: data.description,
      name: data.name,
      totalSupply: 1,
      link: data.link,
      properties: data.properties,
      ...hasCollection,
    });

    setNftSetCreated(true);

    router.push(`/nftSets/${nftSet.id}`);
  };

  return (
    <div className="p-5 mb-10 flex items-center justify-center w-full h-full min-h-[calc(100vh-370px)]">
      {isSubmitting ? (
        <div className="w-full md:w-1/2 md:p-4 text-2xl flex flex-col h-[calc(100vh-490px)] text-gray-700 font-medium dark:text-gray-200 items-start justify-center">
          <div className="flex flex-col text-xl md:text-2xl gap-5 h-full w-full justify-start">
            <div className="text-2xl md:text-4xl">Creating your NFT</div>
            <div className="flex items-center gap-5 w-full h-16 border-2 rounded-lg p-5 md:p-10">
              {!nftSetCreated && (
                <FaRedo className="animate-spin fill-red-500" />
              )}
              {nftSetCreated && <FaCheck className="fill-green-500" />}
              <div>Uploading image</div>
            </div>
            <div className="flex items-center gap-5 w-full h-16 border-2 rounded-lg p-5 md:p-10">
              {!nftSetCreated && (
                <FaRedo className="animate-spin fill-red-500" />
              )}
              {nftSetCreated && <FaCheck className="fill-green-500" />}
              <div>Nft set created</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="md:p-4 text-2xl flex flex-col text-gray-700 font-medium dark:text-gray-200 h-full">
            <h1 className="text-4xl my-5">Create New Item</h1>
            <CreateItem
              onSubmit={handleOnSumbit}
              collections={collections}
              defaultCollection={collection}
            />
          </div>
        </>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: { destination: "/login", permanent: false },
      props: {},
    };
  }

  const collections = await prisma.collection.findMany({
    where: {
      userId: session.user?.id,
      visible: true
    }
  });

  return {
    props: {
      session: session as Session,
      collections: collections as Collection[],
    },
  };
};

export default CreateNftPage;
