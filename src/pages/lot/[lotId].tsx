import type {
  NextPage,
} from "next";
import NextError from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";
import LotDetail from "../../components/trade/LotDetail";

const LotPage: NextPage = () => {
  const id = useRouter().query.lotId as string;
  const mutation = trpc.useMutation("lot.update");
  const lotQuery = trpc.useQuery(["lot.get", { id }]);

  useEffect(() => {
    mutation.mutate({ id });
  }, [id]);

  if (lotQuery.error) {
    return (
      <NextError
        title={lotQuery.error.message}
        statusCode={lotQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (lotQuery.status !== "success") {
    return <>Loading...</>;
  }

  if (!lotQuery.data) {
    return <>Unknown lot...</>;
  }

  const lot = lotQuery.data;
 
  return (
    <div className="flex items-center justify-center w-full">
      <LotDetail lot={lot} />
    </div>
  );
};

export default LotPage;
