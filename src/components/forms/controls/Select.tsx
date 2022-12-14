import React, { InputHTMLAttributes, useCallback, useEffect } from "react";
import { useState } from "react";
import { 
  FaAsterisk,
  FaChevronDown,
} from "react-icons/fa";
import { SelectContext } from "../../../context/selectContext";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";

interface SelectProps extends InputHTMLAttributes<HTMLInputElement> {
  caption?: string;
  children: React.ReactNode;
  initialValue?: {
    key: string;
    value: any;
  };
  label: string;
  name: string;
  register: any;
  setValue: any;
}

const classes = " w-full p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 font-normal text-xl focus:outline-none focus:border-gray-500";

export const Select = ({ caption, children, initialValue, label, name, placeholder, required, register, setValue, ...rest }: SelectProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const showDropdownHandler = () => {
    setShowDropdown(!showDropdown);
  }

  const selectContainerRef = React.createRef<HTMLInputElement>();
  const clickOutsideHandler = () => setShowDropdown(false);

  useOnClickOutside(selectContainerRef, clickOutsideHandler);

  const updateSelectedOption = useCallback((option: { key: string, value: any }) => {
    setValue(name, option.key);
    setSelectedOption(option.value);
    setShowDropdown(false);
  }, [name, setValue]);

  useEffect(() => {
    if (initialValue) {
      setValue(name, initialValue?.key);
      setSelectedOption(initialValue?.value);
    }
  }, [initialValue, name, setValue, setSelectedOption])

  return (

  <div className="flex flex-col my-6">
    <div className="flex items-center my-1">
      <label className="text-xl" htmlFor={name}>{label}</label>
      {required ? <FaAsterisk className="fill-red-500 ml-2" size={10}/> : null}
    </div>

    {caption && <label className="mb-3 text-gray-400 text-sm">{caption}</label>}
    
    <SelectContext.Provider value={{ selectedOption, changeSelectedOption: updateSelectedOption }}>
      <div ref={selectContainerRef} className="relative w-full flex" onClick={showDropdownHandler}>
    
        <input {...register(name, { required })} className="hidden" id={name} {...rest}/>    
        <div className="w-full flex relative cursor-pointer">
          <input placeholder={placeholder} value={selectedOption} readOnly className={`${classes} cursor-pointer`}/>
          <FaChevronDown size={25} className={`fill-gray-700 dark:fill-gray-400 font-light cursor-pointer absolute right-5 top-5 transition-all ${showDropdown ? 'rotate-180' : ''}`} />
        </div>
    
        <div className={`absolute left-0 top-[100%] ${showDropdown ? "" : "hidden"} transition-all ease-in-out delay-150 w-full pb-10 h-40 z-20`}>
          <ul className="
            bg-white 
            overflow-scroll h-96 rounded-md 
            shadow-[0px_0px_15px_5px_rgba(186,186,186,0.57)] 
            dark:shadow-none
            dark:border
          dark:border-gray-300 dark:bg-slate-800
            transition-opacity ease-in-out delay-150 
          ">
            {children}
          </ul>
        </div>
      </div>
    </SelectContext.Provider>
  </div>

  );
}