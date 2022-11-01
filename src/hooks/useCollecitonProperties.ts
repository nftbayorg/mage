import create from "zustand";

type CollectionStore = {
  selectedPropertyIds: Set<string>;
  toggleSelectedPropertyId: (id: string) => void;
}

export const useCollectionStore = create<CollectionStore>((set) => ({
    selectedPropertyIds: new Set(),
    toggleSelectedPropertyId: (id: string) => set(({ selectedPropertyIds }) => {

      const updatedSet = new Set(selectedPropertyIds);
      const propertyInStore = selectedPropertyIds.has(id);
      propertyInStore ? selectedPropertyIds.delete(id) : selectedPropertyIds.add(id);

      return { selectedPropertyIds: updatedSet };
    }),
}));
  