import { useState } from "react";
import React from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

type NavMenuProps = {
  caption?: string;
  children: React.ReactNode;
  icon?: React.ReactElement;
  activeIcon?: React.ReactElement;
  position: "left" | "right";
}

type NavMenuItemProps = {
  caption: string;
  icon?: React.ReactElement;
  onClick: () => void;
}

export const NavMenuItem = ({ caption, icon, onClick }: NavMenuItemProps) => (
  <div 
    className="
      border-b 
      border-b-gray-300 
      flex 
      gap-5
      p-5 
      items-center 
      justify-start 
      cursor-pointer 
      bg-black bg-opacity-0
      hover:bg-opacity-5
      hover:text-blue-500
      hover:fill-blue-500
      text-gray-700 dark:text-gray-300
      font-bold
    " 
    onClick={onClick}
  >
    {icon && React.cloneElement(icon, { 
      className: `${icon.props.classes} hover:fill-blue-500`
    })}
    <div>{caption}</div>
  </div>
);

export const NavMenu = ({ caption, children, icon, activeIcon }: NavMenuProps) => {

  const [active, setActive] = useState(false);
  const ref = React.createRef<HTMLDivElement>();

  useOnClickOutside(ref, () => setActive(false));

  const toggle = () => {
    setActive(prev => !prev);
  }

  return (
    <div className="h-full w-full relative z-[1000]" ref={ref}>
      <div className="w-14 h-14 absolute -left-4 -top-4 cursor-pointer" onClick={toggle} >
        <div className="absolute top-0 left-3">
          {!activeIcon && icon && React.cloneElement(icon, { 
            className: `${icon.props.classes} hover:fill-blue-500`
          })}
          {activeIcon && !active && icon && React.cloneElement(icon, { 
            className: `${icon.props.classes} hover:fill-blue-500`
          })}
          {activeIcon && active && activeIcon && React.cloneElement(activeIcon, { 
            className: `${activeIcon.props.classes} hover:fill-blue-500`
          })}
          {caption && caption}
        </div>
        <div 
          className={`
            ${!active ? "hidden": "visible"}
            border dark:border-gray-300 bg-white dark:bg-slate-800
            transition-opacity ease-in-out delay-150 
            h-fit w-72
            absolute md:relative top-12 -left-60 
            rounded-lg shadow-lg 
            overflow-hidden
          `}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
