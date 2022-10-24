import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "../../forms/controls/Checkbox";
import { Menu, MenuGroup, MenuItem } from "../../layout/Menu"

type CollectionMenuProps = {
  collapsed: boolean;
  collectionProperties: CollectionNftSetProperties | null;
  onFilterSelection?: ({ properties }: { properties: CollectionNftSetProperty[] }) => void;
}

export const CollectionMenu = ({ collapsed, collectionProperties }: CollectionMenuProps) => {

  const [properties, setProperties] = useState(collectionProperties);

  const [selectedProperties, setSelectedProperties] = useState<CollectionNftSetProperty[]>([]);

  const handleClick = useCallback((clickedProperty) => {
    const findPredicate = prop => prop.name === clickedProperty.name && prop.type === clickedProperty.type;
    const filterPredicate = prop => prop.name !== clickedProperty.name && prop.type !== clickedProperty.type;

    if (selectedProperties.find(findPredicate)) {
      setSelectedProperties(prev => prev.filter(filterPredicate));
    } else {
      setSelectedProperties(prev => ([...prev, clickedProperty]));
    }
  }, [selectedProperties]);

  const determineCheckedState = useCallback(value => {
    if (selectedProperties && selectedProperties.find(prop => prop.name === value.name && prop.type === value.type)) {
      return true;
    }

    return false;
  }, [selectedProperties])

  return (
    <Menu classesName={`
      hidden md:flex flex-col
      transform-gpu transition-all ease-in-out delay-20 
      ${collapsed ? 'w-[0px] min-w-[0px] overflow-hidden' : 'sticky top-[150px] z-[5000] min-w-[350px] h-max'}`}
    >
      <>
        {properties && Object.keys(properties.propertyCounts).map(propertyKey => (
          <MenuGroup
            key={propertyKey}
            label={
              <div className="flex items-center font-medium text-ellipsis whitespace-nowrap overflow-hidden w-full">
                <div>{propertyKey}</div>
                <div className="ml-auto px-4 text-sm text-gray-700 dark:text-gray-500">{properties.propertyCounts[propertyKey]?.length}</div>
              </div>
            }
            collapsible={true}
            defaultState="collapsed"
          >
            <>
              {properties.propertyCounts && properties.propertyCounts[propertyKey]?.map(value => {
                if (value) {
                  return (
                    <MenuItem key={value.name} onClick={() => handleClick(value)}>
                      <div className="flex items-center font-medium text-ellipsis whitespace-nowrap overflow-hidden w-full">
                        <div>{value.name}</div>
                        <div className="ml-auto px-3 text-sm text-gray-700 dark:text-gray-500">{value._count}</div>
                        <Checkbox initialValue={determineCheckedState(value)}/>
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
