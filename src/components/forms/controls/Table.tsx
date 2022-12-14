import React from "react";

type TableProps = {
  children: React.ReactElement[] | React.ReactElement;
}

type TableContentProps = {
  children: React.ReactElement[] | React.ReactElement;
}


export const TableHeader = ({ children }: TableContentProps) => (
  <div className={`absolute top-0 left-0 grid grid-cols-5 gap-5 py-2 px-4 dark:bg-gray-900 items-center w-max md:w-full`}>
    {children}
  </div>
)

export const Row = ({ children }: TableContentProps) => (
  <div className={`grid grid-cols-5 gap-5 h-10 px-4 w-max lg:w-full`}>
    {children}
  </div>
)

export const Column = ({ children }: TableContentProps) => (
  <div className="w-40 md:w-full overflow-hidden">
    {children}
  </div>
)

export const Table = ({ children }: TableProps) => {
  return (
    <div className="flex flex-col overflow-x-scroll relative pt-12 w-full">
      {children}
    </div>
  )
}
