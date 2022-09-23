import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";

import Sidebar from "../../components/layout/Sidebar";
import LotSummary from "../../components/views/lots/LotSummary";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useRestoreScroll } from "../../hooks/useRestoreScroll";

const Trade: NextPage = () => {

  const [listRef] = useRestoreScroll<HTMLDivElement>();
 
  const results = trpc.proxy.auction.getInfiniteAuctions.useInfiniteQuery({ 
    limit: 3,
  }, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });

  const { lastItemRef } = useInfiniteScroll(results.isLoading, results.hasNextPage, results.fetchNextPage);

  if (!results.data) return <div>Loading...</div>

  const pages = results.data.pages; 

  return (
    <div className="flex">
      <Sidebar />
      <div 
        ref={listRef} 
        className="md:p-4 text-2xl flex-1 h-screen text-gray-700 font-medium dark:text-gray-300 overflow-y-scroll"
      >
        Trade
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {pages.map(page => {
            if (page.items) {
              const auctions = page.items;
              let lastAuction = false;
              let lastLot = false;
            
              return (auctions.map((auction, auctionIndex) => {
                lastAuction = auctions.length === auctionIndex + 1;
                if (!auction.lots) return;
            
                return auction.lots.map((lot, lotIndex) => {
                  lastLot = auction.lots.length === lotIndex + 1;
            
                  if (lastAuction && lastLot) return <LotSummary ref={lastItemRef} lot={lot} key={lot.id}/>
            
                  return (<LotSummary lot={lot} key={lot.id}/>)
                })
              }))            
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Trade;
