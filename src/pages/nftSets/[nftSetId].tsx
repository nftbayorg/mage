import type { NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import NftSetDetail from "../../components/views/nfts/nftSetDetail";

const NftSetDetailPage: NextPage = () => {
  const id = useRouter().query.nftSetId as string;
  const nftSetQuery = trpc.nftSet.get.useQuery({ id });

  if (nftSetQuery.error) {
    return (
      <NextError
        title={nftSetQuery.error.message}
        statusCode={nftSetQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  const nftSet = nftSetQuery.data;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <NftSetDetail nftSet={nftSet} />
    </div>
  );
};

export default NftSetDetailPage;
