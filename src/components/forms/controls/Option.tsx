import { useSelectContext } from "../../../hooks/useSelectContext";

type OptionProps = {
  children: React.ReactNode | React.ReactNode[];
  value: [string, any];
}

export const Option = ({ children, value }: OptionProps) => {
  const { changeSelectedOption } = useSelectContext();
  
  return (
    <option 
      className="
        border-b 
        border-b-gray-300 
        flex 
        p-5 
        items-center 
        justify-start 
        cursor-pointer 
        dark:hover:shadow-none
        bg-black bg-opacity-0
        dark:bg-white dark:bg-opacity-0
        dark:hover:bg-opacity-10
        hover:bg-opacity-10
        hover:text-blue-500
        dark:hover:fill-white
        dark:hover:text-white
      " 
      value={value}
      onClick={() => changeSelectedOption({ key: value[0], value: value[1] })}
    >
      {children}
    </option>
  );
}