import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { trpc } from "../../utils/trpc";

import CollectionDetail from "../../components/views/collections/CollectionDetail";
import { useCollectionStore } from "../../hooks/useCollectionProperties";
import { useCallback, useEffect, useState } from "react";
import fetchFloorPrices from "../../server/data/fetchFloorPrices";
import { CollectionWithNftSets } from "../../utils/computed-properties";
import fetchMageCollection from "../../server/data/fetchCollection";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const CollectionDetailPage = ({ collection, collectionProperties, floorPrice }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const setCollection = useCollectionStore(useCallback((state) => state.setCollection, []));
  const setNftSets = useCollectionStore(useCallback((state) => state.setNftSets, []));
  const setCollectionProperties = useCollectionStore(useCallback((state) => state.setCollectionProperties, []));
  const selectedPropertyIds = useCollectionStore(useCallback((state) => state.selectedPropertyIds, []));
  const selectedCombinations = useCollectionStore(useCallback((state) => state.selectedCombinations, []));
  const searchValues = useCollectionStore(useCallback((state) => state.searchValues, []));
  const [collectionId] = useState(collection?.id);

  const results = trpc.nftSet.getInfiniteNftSets.useInfiniteQuery(
    {
      collectionId: collectionId,
      filters: selectedCombinations,
      ...(searchValues.size > 0 ? {
        names: Array.from(searchValues),
      } : {}),
      limit: 4,
    },
    {
      onSuccess: (result) => {
        if (result.pages) {
          const nftSets = result.pages.map((page) => page.items).flat();
          setNftSets(nftSets || []);
        }
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: true,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    console.log("Results", results)
  }, [results])

  const { lastItemRef } = useInfiniteScroll(
    results.isLoading,
    results.hasNextPage,
    results.fetchNextPage
  );

  useEffect(() => {
    if (collection) {
      setCollection(collection);
      setCollectionProperties(collectionProperties);
    }
  }, []);

  return (
    <div className="flex items-center justify-center w-full">
      <CollectionDetail floorPrice={floorPrice} ref={lastItemRef} />
    </div>
  );
};

type CollectionDetailPageProps = {
  collection: CollectionWithNftSets | null;
  collectionProperties: CollectionNftSetProperties | null;
  floorPrice: number;
}

export const getServerSideProps: GetServerSideProps<CollectionDetailPageProps> = async (
  ctx: GetServerSidePropsContext
) => {

  let floorPrice = 0;
  const { collection, collectionProperties } = await fetchMageCollection(ctx.params?.collectionId as string || '');

  if (collection) {
    try {
      const { sources } = await fetchFloorPrices(collection.tokenAddress || '');
      floorPrice = sources[0]?.floorAskPrice || 0;
    } catch (error) {
      floorPrice = 0;
    }
  }

  return {
    props: {
      collection,
      collectionProperties,
      floorPrice
    }
  };
};

export default CollectionDetailPage;
