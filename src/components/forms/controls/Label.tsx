import React, { InputHTMLAttributes, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface LabelProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  caption: string;
  collapsible?: boolean;
  defaultState?: "expanded" | "collapsed";
}

const Label = ({ caption, collapsible, defaultState, ...rest }: LabelProps) => {
  const [collapsed, setCollapsed] = useState(collapsible && defaultState === "collapsed");

  return (
    <div className="flex flex-col my-6 w-full">
      <div className={`text-xl ${collapsed ? 'h-8' : 'h-fit'} overflow-hidden text-ellipsis max-w-[100%]`}>{caption}</div>
      <div onClick={() => setCollapsed(prev => !prev)} className="cursor-pointer hover:text-gray-500 dark:hover:text-gray-400 w-fit">
        {collapsible && collapsed && <div className="flex items-center gap-1">See more <FaChevronDown/></div>}
        {collapsible && !collapsed && <div className="flex items-center gap-1">See less <FaChevronUp/></div>}
      </div>
    </div>
  )
}

export default Label;