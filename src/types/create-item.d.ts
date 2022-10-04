type CreateItemFormValues = {
  file: File;
  name: string;
  totalSupply: integer;
  link?: string;
  description?: string;
  collectionId: string;
};

type CreateCollectionFormValues = {
  logoImageFile: File;
  featuredImageFile?: File;
  bannerImageFile?: File;
  name: string;
  description?: string;
  collectionId: string;
};
