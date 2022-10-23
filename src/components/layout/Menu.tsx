import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type MenuProps = {
  children: React.ReactElement[] | React.ReactElement;
  classesName?: string;
  onItemClicked?: () => void;
}

type MenuGroupProps = {
  children: React.ReactElement[] | React.ReactElement;
  collapsible?: boolean;
  className?: string;
  defaultState?: "expanded" | "collapsed";
  label: React.ReactElement;
  onCollapse?: () => void;
  onExpand?: () => void;
}

type MenuItemProps = {
  children: React.ReactElement;
  className?: string;
  onClick?: (event: React.SyntheticEvent) => void;
}

export const MenuItem = ({ children, className, onClick }: MenuItemProps) => {

  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    onClick && onClick(event); 
  }

  return (
    <li className={`flex items-center justify-start w-full font-light hover:bg-gray-200 dark:hover:bg-gray-700 p-3 pr-1 rounded-lg ${className}`} onClick={handleClick}>
      {children}
    </li>
  );
}

export const MenuGroup = ({ children, className, collapsible, defaultState, label }: MenuGroupProps) => {

  const [collapsed, setCollapsed] = useState(collapsible && defaultState === "collapsed")

  return (
    <ul 
      onClick={() => setCollapsed(prev => !prev)} 
      className={`${collapsible && "cursor-pointer"} 
        flex flex-col items-center justify-start 
        text-gray-700 dark:text-gray-100 
        w-full
      `}
    >
      <div className="w-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 p-3 rounded-lg">
        {label}
        {collapsible && 
          <div className="ml-auto">
            {collapsed && <FaChevronDown size={15} className="fill-gray-700 dark:fill-gray-200 font-light" />}
            {!collapsed && <FaChevronUp size={15} className="fill-gray-700 dark:fill-gray-200 font-light" />}
          </div>
        }
      </div>
      <div className={`
        ${collapsed ? "max-h-0 border-0" : "max-h-96"}  
        transition-all ease-in-out duration-500 
        flex flex-col items-center justify-start
        w-full
        overflow-scroll
        ${className}
        `
      }>
        <div className="p-2 w-full">
          {children}
        </div>
      </div>
    </ul>
  );
}

export const Menu = ({ children, classesName }: MenuProps) => {
  return (
    <nav className={`${classesName}`}>
      {children}
    </nav>
  );
}
