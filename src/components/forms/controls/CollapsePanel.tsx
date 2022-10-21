import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useState } from "react";

type CollapsePanelProps = {
  children?: React.ReactNode;
  collapsible?: boolean;
  classesOverride?: string;
  defaultState?: "expanded" | "collapsed";
  icon: React.ReactNode;
  label: string;
}

export const CollapsePanel = ({ children, classesOverride, collapsible, defaultState, icon, label }: CollapsePanelProps) => {

  const [panelCollapsed, setPanelCollapsed] = useState(collapsible && defaultState === "collapsed")

  return (
    <section>
      <div 
        onClick={() => collapsible && setPanelCollapsed(prev => !prev)} 
        className={`${panelCollapsed && "rounded-b-xl"} ${collapsible && "cursor-pointer"} flex py-7 px-4 md:p-7 border border-gray-200 dark:border-gray-600 rounded-t-xl items-center justify-start`}
      >
        <div className="min-w-1/5">{icon}</div>
        <div className="ml-5 text-xl font-semibold text-gray-700 dark:text-gray-200 truncate pr-4">
          {label}
        </div>
        {collapsible && 
          <div className="ml-auto">
            {panelCollapsed && <FaChevronDown size={25} className="fill-gray-700 dark:fill-gray-400 font-light" />}
            {!panelCollapsed && <FaChevronUp size={25} className="fill-gray-700 dark:fill-gray-400 font-light" />}
          </div>
        }
      </div>
      <div className={`
        ${classesOverride}
        ${panelCollapsed ? "max-h-0 border-0 p-0 md:p-0" : "max-h-fit p-5 md:p-10"} 
        transition-[height] ease-in-out delay-100 
        flex flex-col items-center justify-center
        border border-t-0 border-gray-200 dark:border-gray-600 
        rounded-b-xl bg-gray-50 dark:bg-gray-700 
        overflow-hidden
        `
      }>
        {children}
      </div>
    </section>
  )
}