import create from "zustand";

type CollectionStore = {
  selectedPropertyIds: Set<string>;
  selectedCombinations: {},
  toggleSelectedPropertyIds: (propertyKey: string, id: string[] | undefined) => void;
}

export const useCollectionStore = create<CollectionStore>((set) => ({
    selectedPropertyIds: new Set(),
    selectedCombinations: {},
    toggleSelectedPropertyIds: (propertyKey: string, ids: string[] | undefined) => set(({ selectedPropertyIds, selectedCombinations }) => {

      if (!ids) return {};

      const idsToStore = new Set([...ids, ...selectedCombinations[propertyKey] || []]);
      const updatedSet = new Set(selectedPropertyIds);
      
      ids?.forEach(id => {
        const propertyInStore = updatedSet.has(id);

        if (propertyInStore) {
          idsToStore.delete(id);
          updatedSet.delete(id);
        } else {
          updatedSet.add(id);
        }
      });

      const updatedCombinations = {
        ...selectedCombinations,
        [propertyKey]: Array.from(idsToStore)
      };

      return { selectedPropertyIds: updatedSet, selectedCombinations: updatedCombinations };
    }),
}));
  