import create from "zustand";
import { CollectionWithNftSets } from "../utils/computed-properties";

type CollectionStore = {
  collection: CollectionWithNftSets | null;
  collectionProperties: CollectionNftSetProperties | null;
  selectedPropertyIds: Set<string>;
  selectedProperties: { [key: string]: string[] },
  selectedCombinations: {},
  searchValues: Set<string>;
  setSearchValue: (value: string) => void;
  removeSearchValue: (value: string) => void;
  resetSelectedProperties: () => void;
  setCollection: (newCollection: CollectionWithNftSets | null) => void;
  setCollectionProperties: (properties: CollectionNftSetProperties | null) => void;
  toggleSelectedPropertyIds: (propertyKey: string, variantKey: string | undefined, id: string[] | undefined) => void;
}

export const useCollectionStore = create<CollectionStore>((set) => ({
    collection:  null,
    collectionProperties: null,
    selectedPropertyIds: new Set(),
    selectedProperties: {},
    selectedCombinations: {},
    searchValues: new Set(),
    removeSearchValue: (value: string) => set(({ searchValues }) => { 
      const updatedSet = new Set(searchValues);
      updatedSet.delete(value);
      return { searchValues: updatedSet }
    }),
    resetSelectedProperties: () => set(() => {
      return { selectedProperties: {}, selectedPropertyIds: new Set(), selectedCombinations: {}, searchValues: new Set() }
    }),
    setCollection: (newCollection: CollectionWithNftSets | null) => set(({ collection }) => {

      return (newCollection?.id !== collection?.id) ? 
        { collection: newCollection, selectedCombinations: {}, selectedProperties: {}, selectedPropertyIds: new Set()}
        :
        { collection: newCollection }
    }),
    setCollectionProperties: (properties: CollectionNftSetProperties | null) => set({ collectionProperties: properties }),
    setSearchValue: (value: string) => set(({ searchValues }) => { 
      const updatedSet = new Set(searchValues);
      updatedSet.add(value);
      return { searchValues: updatedSet }
    }),
    toggleSelectedPropertyIds: (
      propertyKey: string, 
      variantKey: string | undefined, 
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
          delete updatedSelectedProperties[`${propertyKey}${variantKey ? `: ${variantKey}` : ''}`];
        } else {
          updatedSelectedProperties[`${propertyKey}${variantKey ? `: ${variantKey}` : ''}`] = ids;
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
  