import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { prisma } from "../../server/db/client";

import CollectionDetail from "../../components/views/collections/CollectionDetail";
import { CollectionWithNftSets } from '../../utils/computed-properties';
import { useCollectionStore } from "../../hooks/useCollecitonProperties";
import { useCallback, useEffect } from "react";

const CollectionDetailPage = ({ collection, collectionProperties }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const selectedPropertyIds = useCollectionStore(useCallback((state) => state.selectedPropertyIds, []))

  return (
    <div className="flex items-center justify-center w-full">
      <CollectionDetail collection={collection} collectionProperties={collectionProperties} />
    </div>
  );
};

type CollectionDetailPageProps = {
  collection: CollectionWithNftSets | null;
  collectionProperties: CollectionNftSetProperties | null;
}

export const getServerSideProps: GetServerSideProps<CollectionDetailPageProps> = async (
  ctx: GetServerSidePropsContext
) => {

  const collection = await prisma.collection.findFirst({
    where: {
      id: ctx.params?.collectionId as string || '',
      visible: true
    },
    include: {
      nftSets: true,
    },
  });

  let collectionProperties: CollectionNftSetProperties | null = null;

  if (collection) {
    const properties = await prisma.nFTSetProperties.groupBy({
      by: ['type', 'name', 'id'],
      where: {
         nftSetId: {
           in: collection?.nftSets.map(set => set.id)
         }
      },
      _count: {
        name: true,
      },
    })

    const resolveTypeValues = (
      typeValue: { _count: { name: number; }, name: string; type:string; id: string; }, 
      prevValue: { _count: number; variants: [{ name: string;  ids: string; }] }
    ) => {
      prevValue = prevValue || { _count: 0, variants: {} };

      return { 
        _count: prevValue._count + typeValue._count.name, 
        variants: {...prevValue.variants, [typeValue.name]: [...prevValue.variants[typeValue.name] || '', typeValue.id] }
      }
    }

    collectionProperties = {
      nftSetsInCollection: collection.nftSets.length,
      propertyCounts: properties.reduce((prev, current) => {
        return {...prev, [current.type]: resolveTypeValues(current, prev[current.type])}
      }, {})
    }    
  }

  return {
    props: {
      collection,
      collectionProperties
    }
  };
};

export default CollectionDetailPage;
