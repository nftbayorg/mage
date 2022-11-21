import { useCallback, useEffect, useState } from "react";
import { useCollectionStore } from "../../../hooks/useCollectionProperties";
import { Checkbox } from "../../forms/controls/Checkbox";
import { Menu, MenuGroup, MenuItem } from "../../layout/Menu"

export const CollectionMenu = () => {
  
  const [properties, setProperties] = useState<CollectionNftSetProperties | null>();
  const toggleSelectedPropertyIds = useCollectionStore(useCallback((state) => state.toggleSelectedPropertyIds, []));
  const selectedPropertyIds = useCollectionStore(useCallback((state) => state.selectedPropertyIds, []));
  const collectionProperties = useCollectionStore(useCallback((state) => state.collectionProperties, []));

  useEffect(() => {
  
    setProperties(collectionProperties);
  }, [collectionProperties]);

  const handleClick = useCallback((propertyKey: string, nameKey: string, propertyIds: string[] | undefined) => {
    toggleSelectedPropertyIds(propertyKey, nameKey, propertyIds);
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
      <MenuGroup 
        key={"status"}
        label={
          <div className="flex items-center font-medium text-ellipsis whitespace-nowrap overflow-hidden w-full">
            <div>Status</div>
          </div>
        }
        collapsible={true}
        defaultState="expanded"
      >
        <MenuItem key={"BuytNow"} onClick={() => handleClick("BuyNow", "BuyNow", ["BuyNow"])}>
          <div className="flex items-center font-medium text-ellipsis whitespace-nowrap overflow-hidden w-full">
            <div>Buy Now</div>
            <div className="ml-auto">
              <Checkbox initialValue={determineCheckedState(["BuyNow"])}/>
            </div>
          </div>
        </MenuItem>
        <MenuItem key={"OnAuction"} onClick={() => handleClick("OnAuction", "OnAuction", ["OnAuction"])}>
          <div className="flex items-center font-medium text-ellipsis whitespace-nowrap overflow-hidden w-full">
            <div>On Auction</div>
            <div className="ml-auto">
              <Checkbox initialValue={determineCheckedState(["OnAuction"])}/>
            </div>
          </div>
        </MenuItem>
      </MenuGroup>
    </Menu>
  );
}
