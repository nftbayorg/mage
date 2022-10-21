import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { trpc } from "../../utils/trpc";

import Sidebar from "../../components/layout/Sidebar";
import LotSummary from "../../components/views/lots/LotSummary";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useRestoreScroll } from "../../hooks/useRestoreScroll";
import { Collection } from "prisma/prisma-client";
import { prisma } from "../../server/db/client";

const TradePage: NextPage = ({ collections }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [listRef] = useRestoreScroll<HTMLDivElement>();

  const results = trpc.auction.getInfiniteAuctions.useInfiniteQuery(
    {
      limit: 3,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const { lastItemRef } = useInfiniteScroll(
    results.isLoading,
    results.hasNextPage,
    results.fetchNextPage
  );

  const pages = results.data?.pages;

  return (
    <div className="flex">
      <Sidebar collections={collections}/>
      <div
        ref={listRef}
        className="md:p-4 text-2xl flex-1 h-screen text-gray-700 font-medium dark:text-gray-200 overflow-y-scroll"
      >
        Trade
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {pages && pages[0]?.items?.length ? (
            pages.map((page) => {
              if (page.items) {
                const auctions = page.items;
                let lastAuction = false;
                let lastLot = false;

                return auctions.map((auction, auctionIndex) => {
                  lastAuction = auctions.length === auctionIndex + 1;
                  if (!auction.lots) return;

                  return auction.lots.map((lot, lotIndex) => {
                    lastLot = auction.lots.length === lotIndex + 1;

                    if (lastAuction && lastLot)
                      return (
                        <LotSummary ref={lastItemRef} lot={lot} key={lot.id} />
                      );

                    return <LotSummary lot={lot} key={lot.id} />;
                  });
                });
              }
            })
          ) : (
            <div>No items for sale</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {

  const collections = await prisma.collection.findMany({
    where: {
      visible: true
    }
  });

  return {
    props: {
      collections: collections as Collection[]
    },
  };
};


export default TradePage;
