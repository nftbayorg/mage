import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { getMageAuthSession } from "../server/common/get-server-session";
import { trpc } from "../utils/trpc";

import Sidebar from "../components/Sidebar";
import TradeItem from "../components/TradeItem";

const Trade: NextPage = () => {

  const items = trpc.proxy.item.getAll.useQuery();

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 text-2xl flex-1 h-screen overflow-scroll text-gray-700 font-medium dark:text-gray-300">
        Trade
        <div className="p-10 grid grid-cols-4">
          {items.data && items.data.map(item => {
            return <TradeItem item={item} key={item.id}/>
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
