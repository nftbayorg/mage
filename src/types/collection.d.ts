type CollectionNftSetProperty = {
  [type: string]: {
    _count: number;
    variants: {
      [name: string]: string[];
    }
  }
}

type CollectionNftSetProperties = {
  nftSetsInCollection: number;
  propertyCounts: CollectionNftSetProperty;
}

  