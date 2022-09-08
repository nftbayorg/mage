import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { getMageAuthSession } from "../../server/common/get-server-session";

import LotDetail from "../../components/trade/LotDetail";
import { useRouter } from "next/router";

const Lot: NextPage = () => {
  const id = useRouter().query.lotId as string;

  return (
    <div className="flex items-center justify-center w-full">
      <LotDetail id={id} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getMageAuthSession(ctx);

  // if (session) {
  //   return {
  //     redirect: { destination: "/", permanent: false },
  //     props: {},
  //   };
  // }

  return {
    props: {
      session,
    },
  };
};

export default Lot;
