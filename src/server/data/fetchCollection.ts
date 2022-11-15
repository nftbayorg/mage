import { prisma } from "../../server/db/client";
import { MageCollection } from "../../utils/computed-properties";

export default async function fetchMageCollection(collectionId: string): Promise<MageCollection> {

  const collection = await prisma.collection.findFirst({
    where: {
      id: collectionId,
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
    });

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
  } else {
    return Promise.reject(`Failed to locate the collection for id ${collectionId}`);
  }

  return {
    collection,
    collectionProperties
  }
}
  