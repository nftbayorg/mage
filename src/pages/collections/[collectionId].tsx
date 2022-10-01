import type { NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import CollectionDetail from "../../components/views/collections/CollectionDetail";

const CollectionDetailPage: NextPage = () => {
  const id = useRouter().query.collectionId as string;
  const collectionQuery = trpc.useQuery(["collection.get", { id }]);

  if (collectionQuery.error) {
    return (
      <NextError
        title={collectionQuery.error.message}
        statusCode={collectionQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  const collection = collectionQuery.data;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <CollectionDetail collection={collection} />
    </div>
  );
};

export default CollectionDetailPage;
