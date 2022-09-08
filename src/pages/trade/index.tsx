import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { getMageAuthSession } from "../../server/common/get-server-session";
import { trpc } from "../../utils/trpc";

import Sidebar from "../../components/Sidebar";
import LotSummary from "../../components/trade/LotSummary";

const Trade: NextPage = () => {

  const results = trpc.proxy.auction.getAll.useQuery();
  if (!results.data) return <div>Loading...</div>
  const auctions = results.data; 

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 text-2xl flex-1 h-screen overflow-scroll text-gray-700 font-medium dark:text-gray-300">
        Trade
        <div className="p-10 grid grid-cols-4">
          {auctions.map(auction => {
            if (auction.lots) {
              return auction.lots.map(lot => {
                return (<LotSummary lotId={lot.id} key={lot.id}/>)
              })
            }
          })}
        </div>
      </div>
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

export default Trade;
