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
        hover:shadow-[0px_0px_15px_5px_rgba(186,186,186,0.57)]" 
      value={value}
      onClick={() => changeSelectedOption({ key: value[0], value: value[1] })}
    >
      {children}
    </option>
  );
}