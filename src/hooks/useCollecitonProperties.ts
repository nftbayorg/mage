import create from "zustand";

type CollectionStore = {
  selectedPropertyIds: Set<string>;
  toggleSelectedPropertyIds: (id: string[] | undefined) => void;
}

export const useCollectionStore = create<CollectionStore>((set) => ({
    selectedPropertyIds: new Set(),
    toggleSelectedPropertyIds: (ids: string[] | undefined) => set(({ selectedPropertyIds }) => {

      const updatedSet = new Set(selectedPropertyIds);
      
      ids?.forEach(id => {
        const propertyInStore = updatedSet.has(id);

        if (propertyInStore) {
          updatedSet.delete(id);
        } else {
          updatedSet.add(id);
        }
      });

      return { selectedPropertyIds: updatedSet };
    }),
}));
  