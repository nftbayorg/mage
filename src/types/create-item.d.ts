type CreateItemPropertyFormValues = {
  id: string;
  type: string; 
  name: string;
}

type CreateItemFormValues = {
  file: File;
  name: string;
  totalSupply: integer;
  link?: string;
  description?: string;
  collectionId: string;
  properties?: CreateItemPropertyFormValues[]
};

type CreateCollectionFormValues = {
  logoImageFile: File;
  featuredImageFile?: File;
  bannerImageFile?: File;
  name: string;
  description?: string;
  collectionId: string;
};
