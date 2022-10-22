import { useEffect, useState } from "react";
import { Menu, MenuGroup, MenuItem } from "../../layout/Menu"

type CollectionMenuProps = {
  collapsed: boolean;
  collectionProperties: CollectionNftSetProperties | null;
}

export const CollectionMenu = ({ collapsed, collectionProperties }: CollectionMenuProps) => {

  const [properties, setProperties] = useState(collectionProperties);

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
                    <MenuItem key={value.name}>
                      <div className="flex items-center font-medium text-ellipsis whitespace-nowrap overflow-hidden w-full">
                        <div>{value.name}</div>
                        <div className="ml-auto pl-1 text-sm text-gray-700 dark:text-gray-500">{value._count}</div>
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
