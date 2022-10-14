import { useState } from "react";

type TooltipProps = {
  children: React.ReactElement;
  label: string;
  position: "top" | "bottom";
}

export const ToolTip = ({ label, children, position }: TooltipProps) => {
  const [active, setActive] = useState(false);

  return (
    <div 
      className="relative" 
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {active && 
        <>
          <div className={`
            absolute -left-10 
            ${position === 'bottom' && "top-8"}
            ${position === 'top' && "bottom-8"}
            bg-black text-white dark:bg-gray-500 dark:text-gray-100
            p-2 z-[30000] w-fit 
            rounded-lg 
            whitespace-nowrap
          `}>
            <span className="text-light text-md">
              {label}
            </span>
          </div>
          <div className={`
            absolute left-[2px] 
            w-0 h-0 
            border-8 border-solid border-transparent border-t-black dark:border-t-gray-500
            ${position === 'bottom' && "rotate-180 top-4"}
            ${position === 'top' && "bottom-4"}
          `}></div>
        </>
      }
      {children}
    </div>
  );
}


