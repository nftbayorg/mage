import { useCallback } from "react";
import { useCollectionStore } from "../../../hooks/useCollectionProperties";
import { Tag } from "../../forms/controls/Tag";

type CollectionFilterTagsProps = {

}

export const CollectionFilterTags = (props: CollectionFilterTagsProps) => {
  const selectedProperties = useCollectionStore(useCallback((state) => state.selectedProperties, []));
  const searchValues = useCollectionStore(useCallback((state) => state.searchValues, []));
  const removeSearchValue = useCollectionStore(useCallback((state) => state.removeSearchValue, []));
  const toggleSelectedPropertyIds = useCollectionStore(useCallback((state) => state.toggleSelectedPropertyIds, []));
  const resetSelectedProperties = useCollectionStore(useCallback((state) => state.resetSelectedProperties, []));

  const handleTagClosed = useCallback((propertyKey, ids) => {
    const splitKey = propertyKey.split(":").filter(p => p !== undefined);
    const keyValue = splitKey[0].replace(":", "");
    const nameValue =  splitKey[1]?.replace(" ","");

    toggleSelectedPropertyIds(keyValue, nameValue, ids);
  }, [toggleSelectedPropertyIds]);

  const handleSearchValueClosed = useCallback((searchValue) => {
    removeSearchValue(searchValue);
  }, [removeSearchValue]);

  const handleResetProperties = useCallback(() => {
    resetSelectedProperties();
  }, [resetSelectedProperties]);

  return (
    <>
      {(Object.keys(selectedProperties).length > 0 || searchValues.size > 0) && 
        <div className="hidden md:flex flex-wrap h-fit gap-5 p-3 items-center pt-0">
          {Array.from(searchValues).map((key, idx) => (
            <Tag key={idx} caption={key} closable={true} onClose={() => handleSearchValueClosed(key)}/>
          ))}
          {Object.keys(selectedProperties).map((key, idx) => (
            <Tag key={idx} caption={key} closable={true} onClose={() => handleTagClosed(key, selectedProperties[key])}/>
          ))}
          <div 
            onClick={handleResetProperties}
            className="flex h-full items-center justify-center p-0 mx-5 font-semibold cursor-pointer hover:text-gray-500"
          >Clear all</div>
        </div>
      }
    </>
  )
}
