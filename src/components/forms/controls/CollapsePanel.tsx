import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useState } from "react";

type CollapsePanelProps = {
  children: React.ReactNode;
  collapsible?: boolean;
  defaultState?: "expanded" | "collapsed";
  icon: React.ReactNode;
  label: string;
}

export const CollapsePanel = ({ children, collapsible, defaultState, icon, label }: CollapsePanelProps) => {

  const [panelCollapsed, setPanelCollapsed] = useState(collapsible && defaultState === "collapsed")

  return (
    <section>
      <div className={`${panelCollapsed ? "rounded-b-xl" : ""} flex p-7 border border-gray-200 dark:border-gray-600 rounded-t-xl items-center`}>
        {icon}
        <div className="ml-5 text-xl font-semibold text-gray-700">
          {label}
        </div>
        {collapsible && 
          <button className="ml-auto" onClick={() => setPanelCollapsed(prev => !prev)}>
            {panelCollapsed && <FaChevronDown size={25} className="fill-gray-700 dark:fill-gray-400 font-light" />}
            {!panelCollapsed && <FaChevronUp size={25} className="fill-gray-700 dark:fill-gray-400 font-light" />}
          </button>
        }
      </div>
      <div className={`${panelCollapsed ? "max-h-0 border-0" : "max-h-screen p-10"} transition-[height] ease-in-out delay-100 flex-col border border-t-0 border-gray-200 dark:border-gray-600 rounded-b-xl items-start justify-start bg-gray-50 overflow-hidden`}>
        {children}
      </div>
    </section>
  )
}