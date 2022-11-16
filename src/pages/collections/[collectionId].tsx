import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { trpc } from "../../utils/trpc";

import CollectionDetail from "../../components/views/collections/CollectionDetail";
import { useCollectionStore } from "../../hooks/useCollectionProperties";
import { useCallback, useState } from "react";
import fetchFloorPrices from "../../server/data/fetchFloorPrices";
import { CollectionWithNftSets } from "../../utils/computed-properties";
import fetchMageCollection from "../../server/data/fetchCollection";

const CollectionDetailPage = ({ collection, collectionProperties, floorPrice }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const selectedPropertyIds = useCollectionStore(useCallback((state) => state.selectedPropertyIds, []));
  const selectedCombinations = useCollectionStore(useCallback((state) => state.selectedCombinations, []));
  const [collecitonId] = useState(collection?.id);
  const [data, setData] = useState(collection);  

  trpc.collection.getFiltered.useQuery(
    {
      id: collecitonId,
      filters: selectedCombinations
    },
    {
      onSuccess: (result) => {
        if (selectedPropertyIds.size > 0) {
          setData(result);
        } else {
          setData(collection);
        }
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  return (
    <div className="flex items-center justify-center w-full">
      <CollectionDetail collection={data} collectionProperties={collectionProperties} floorPrice={floorPrice} />
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
