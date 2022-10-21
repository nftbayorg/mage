import { useState } from "react";
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
  onClick?: () => void;
}

export const MenuItem = ({ children, className, onClick }: MenuItemProps) => {

  return (
    <li className={`flex items-center justify-start w-full font-light ${className}`} onClick={onClick}>
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
        w-full p-2
      `}
    >
      <div className="w-full flex items-center justify-center">
        {label}
        {collapsible && 
          <div className="ml-auto">
            {collapsed && <FaChevronDown size={20} className="fill-gray-700 dark:fill-gray-200 font-light" />}
            {!collapsed && <FaChevronUp size={20} className="fill-gray-700 dark:fill-gray-200 font-light" />}
          </div>
        }
      </div>
      <div className={`
        ${collapsed ? "h-0 max-h-0 border-0" : "h-fit max-h-fit p-5 md:px-3 "} 
        transition-[height] ease-in-out delay-100 
        flex flex-col items-center justify-start
        overflow-scroll
        w-full
        ${className}
        `
      }>
        {children}
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
