import type { NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import CollectionDetail from "../../components/views/collections/CollectionDetail";
import Loading from "../../components/layout/Loading";

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

  if (collectionQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Loading/>
      </div>
    )
  }

  if (!collectionQuery.data) {
    return <>Unknown collection...</>;
  }

  const collection = collectionQuery.data;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <CollectionDetail collection={collection} />
    </div>
  );
};

export default CollectionDetailPage;
