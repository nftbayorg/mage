import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { Session } from "next-auth";
import { useS3Upload } from "next-s3-upload";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaCheck, FaRedo } from "react-icons/fa";
import CreateCollectionForm from "../../components/forms/Collection";

import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";

type PageProps = {
  session: Session;
};

const CreateCollectionPage: NextPage<PageProps> = ({ session }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collectionCreated, setCollectionCreated] = useState(false);
  const [logoImageUploaded, setLogoImageUploaded] = useState(false);
  const [bannerImageUploaded, setBannerImageUploaded] = useState(false);
  const [featuredImageUploaded, setFeaturedImageUploaded] = useState(false);
  const [hasBannerImage, setHasBannerImage] = useState(false);
  const [hasFeaturedImage, setHasFearturedImage] = useState(false);

  let { uploadToS3 } = useS3Upload();

  const createCollection = trpc.collection.create.useMutation();
  const updateImages = trpc.collection.updateImages.useMutation();

  const handleOnSumbit = async (data: CreateCollectionFormValues) => {
    setIsSubmitting(true);
    setHasBannerImage(data.bannerImageFile ? true : false);
    setHasFearturedImage(data.featuredImageFile ? true : false);

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

    const fileReaderResults = await readFiles([
      data.logoImageFile,
      data.featuredImageFile,
      data.bannerImageFile,
    ]);
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

    let collection = await createCollection.mutateAsync({
      description: data.description || "",
      logoImageFile: determineResult(fileReaderResults[0]),
      name: data.name,
      userId: session.user?.id || "",
    });

    setLogoImageUploaded(true);

    if (data.bannerImageFile) {
      collection = await updateImages.mutateAsync({
        id: collection.id,
        bannerImageFile: determineResult(fileReaderResults[2]),
      });

      setBannerImageUploaded(true);
    }

    if (data.featuredImageFile) {
      collection = await updateImages.mutateAsync({
        id: collection.id,
        featuredImageFile: determineResult(fileReaderResults[1]),
      });

      setFeaturedImageUploaded(true);
    }

    setCollectionCreated(true);

    router.push(`/collections/${collection.id}`);
  };

  return (
    <div className="p-5 mb-14 md:mt-14 flex items-center justify-center w-full h-full overflow-y-scroll">
      {isSubmitting ? (
        <div className="w-full md:w-1/2 md:p-4 text-2xl flex flex-col h-[calc(100vh-490px)] text-gray-700 font-medium dark:text-gray-300 items-start justify-center">
          <div className="flex flex-col text-xl md:text-2xl gap-5 h-full w-full justify-start">
            <div className="text-2xl md:text-4xl">Creating your collection</div>
            <div className="flex items-center gap-5 w-full h-16 border-2 rounded-lg p-5 md:p-10">
              {!logoImageUploaded && (
                <FaRedo className="animate-spin fill-red-500" />
              )}
              {logoImageUploaded && <FaCheck className="fill-green-500" />}
              <div>Uploading logo image</div>
            </div>
            {hasBannerImage && (
              <div className="flex items-center gap-5 w-full h-16 border-2 rounded-lg p-5 md:p-10">
                {!bannerImageUploaded && (
                  <FaRedo className="animate-spin fill-red-500" />
                )}
                {bannerImageUploaded && <FaCheck className="fill-green-500" />}
                <div>Uploading banner image</div>
              </div>
            )}
            {hasFeaturedImage && (
              <div className="flex items-center gap-5 w-full h-16 border-2 rounded-lg p-5 md:p-10">
                {!featuredImageUploaded && (
                  <FaRedo className="animate-spin fill-red-500" />
                )}
                {featuredImageUploaded && (
                  <FaCheck className="fill-green-500" />
                )}
                <div>Uploading featured image</div>
              </div>
            )}
            <div className="flex items-center gap-5 w-full h-16 border-2 rounded-lg p-5 md:p-10">
              {!collectionCreated && (
                <FaRedo className="animate-spin fill-red-500" />
              )}
              {collectionCreated && <FaCheck className="fill-green-500" />}
              <div>Collection created</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full md:w-1/2 md:p-4 text-2xl flex flex-col h-full text-gray-700 font-medium dark:text-gray-300 items-start justify-center">
          <h1 className="text-3xl md:text-5xl my-14">Create a Collection</h1>
          <CreateCollectionForm onSubmit={handleOnSumbit} />
        </div>
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
