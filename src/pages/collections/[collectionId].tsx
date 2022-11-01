import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { prisma } from "../../server/db/client";

import CollectionDetail from "../../components/views/collections/CollectionDetail";
import { CollectionWithNftSets } from '../../utils/computed-properties';
import { useCollectionStore } from "../../hooks/useCollecitonProperties";
import { useCallback, useEffect } from "react";

const CollectionDetailPage = ({ collection, collectionProperties }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const selectedPropertyIds = useCollectionStore(useCallback((state) => state.selectedPropertyIds, []))

  useEffect(() => {
    console.log('SelectedPropertyIds', selectedPropertyIds);
  }, [selectedPropertyIds])

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

    console.log("properties", properties);

    const resolveTypeValues = (typeValue: { _count: { name: number}, name: string; type:string, id: string }) => {
      return { _count: typeValue._count.name, name: typeValue.name, type: typeValue.type, id: typeValue.id }
    }

    collectionProperties = {
      nftSetsInCollection: collection.nftSets.length,
      propertyCounts: properties.reduce((prev, current) => {
        return {...prev, [current.type]: prev[current.type] ? [...prev[current.type], resolveTypeValues(current)] : [resolveTypeValues(current)]}
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
