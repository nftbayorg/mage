import { useCallback, useEffect, useState } from "react";
import { useCollectionStore } from "../../../hooks/useCollectionProperties";
import { Checkbox } from "../../forms/controls/Checkbox";
import { Menu, MenuGroup, MenuItem } from "../../layout/Menu"

type CollectionMenuProps = {
  collectionProperties: CollectionNftSetProperties | null;
  onFilterSelection?: ({ properties }: { properties: CollectionNftSetProperty[] }) => void;
}

export const CollectionMenu = ({ collectionProperties }: CollectionMenuProps) => {
  const [properties, setProperties] = useState<CollectionNftSetProperties | null>();
  const toggleSelectedPropertyIds = useCollectionStore(useCallback((state) => state.toggleSelectedPropertyIds, []));
  const selectedPropertyIds = useCollectionStore(useCallback((state) => state.selectedPropertyIds, []));

  useEffect(() => {
    setProperties(collectionProperties);
  }, [collectionProperties]);

  const handleClick = useCallback((propertyKey: string, nameKey: string, propertyIds: string[] | undefined) => {
    toggleSelectedPropertyIds(propertyKey, propertyIds);
  }, [toggleSelectedPropertyIds]);

  const determineCheckedState = useCallback((clickedPropertyIds: string[] | undefined) => {
    let returnValue = false;

    clickedPropertyIds?.forEach(id => {
      if (selectedPropertyIds.has(id)) {
        returnValue = true;
      }
    });

    return returnValue;
  }, [selectedPropertyIds]);

  return (
    <Menu classesName="flex flex-col">
      <>
        {properties && Object.keys(properties.propertyCounts).map(propertyKey => (
          <MenuGroup
            key={propertyKey}
            label={
              <div className="flex items-center font-medium text-ellipsis whitespace-nowrap overflow-hidden w-full">
                <div>{propertyKey}</div>
                <div className="ml-auto px-4 text-sm text-gray-700 dark:text-gray-500">{properties.propertyCounts[propertyKey]?._count}</div>
              </div>
            }
            collapsible={true}
            defaultState="collapsed"
          >
            <>
              {properties.propertyCounts && Object.keys(properties.propertyCounts[propertyKey]?.variants || {}).map((nameKey, idx) => {
                if (properties.propertyCounts[propertyKey]?.variants[nameKey]) {
                  return (
                    <MenuItem key={idx} onClick={() => handleClick(propertyKey, nameKey, properties.propertyCounts[propertyKey]?.variants[nameKey])}>
                      <div className="flex items-center font-medium text-ellipsis whitespace-nowrap overflow-hidden w-full">
                        <div>{nameKey}</div>
                        <div className="ml-auto px-3 text-sm text-gray-700 dark:text-gray-500">{properties.propertyCounts[propertyKey]?.variants[nameKey]?.length}</div>
                        <Checkbox initialValue={determineCheckedState(properties.propertyCounts[propertyKey]?.variants[nameKey])}/>
                      </div>
                    </MenuItem>
                  )
                }
              })}
            </>
        </MenuGroup>
        ))}
      </>
    </Menu>
  );
}
