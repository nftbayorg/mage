import create from "zustand";

type CollectionStore = {
  collectionProperties: CollectionNftSetProperties | null;
  selectedPropertyIds: Set<string>;
  selectedProperties: { [key: string]: string[] },
  selectedCombinations: {},
  setCollectionProperties: (properties: CollectionNftSetProperties | null) => void;
  toggleSelectedPropertyIds: (propertyKey: string, variantKey: string, id: string[] | undefined) => void;
}

export const useCollectionStore = create<CollectionStore>((set) => ({
    collectionProperties: null,
    selectedPropertyIds: new Set(),
    selectedProperties: {},
    selectedCombinations: {},
    setCollectionProperties: (properties: CollectionNftSetProperties | null) => set({ collectionProperties: properties }),
    toggleSelectedPropertyIds: (
      propertyKey: string, 
      variantKey: string, 
      ids: string[] | undefined) => set(({ 
        selectedPropertyIds, selectedCombinations, selectedProperties 
      }) => {

      if (!ids) return {};

      const idsToStore = new Set([...ids, ...selectedCombinations[propertyKey] || []]);
      const updatedSet = new Set(selectedPropertyIds);
      const updatedSelectedProperties = selectedProperties || {};
      
      ids?.forEach(id => {
        const propertyInStore = updatedSet.has(id);

        if (propertyInStore) {
          idsToStore.delete(id);
          updatedSet.delete(id);
          delete updatedSelectedProperties[`${propertyKey}: ${variantKey}`];
        } else {
          updatedSelectedProperties[`${propertyKey}: ${variantKey}`] = ids;
          updatedSet.add(id);
        }
      });

      const updatedCombinations = {
        ...selectedCombinations,
        [propertyKey]: Array.from(idsToStore)
      };

      return { selectedPropertyIds: updatedSet, selectedCombinations: updatedCombinations, selectedProperties: updatedSelectedProperties };
    }),
}));
  