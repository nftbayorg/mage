import React, { useCallback, useRef } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";

type SearchProps = {
  onSubmit?: (value: string) => void;
}

export const Search = (props: SearchProps) => {
  const { onSubmit } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    if (inputRef.current && onSubmit) {
      onSubmit(inputRef.current.value);
      inputRef.current.value = "";
    }
  }, [onSubmit]);

  const handleClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex items-center justify-start gap-5 w-full px-5 rounded-xl cursor-pointer 
        border-2 dark:border-gray-500 dark:hover:border-gray-400
        border-gray-400 hover:border-gray-500
      " onClick={handleClick}
    >
      <FaSearch className="fill-gray-400" size={25}/>
      <input ref={inputRef} className="w-full bg-transparent outline-none cursor-pointer" placeholder="Search by name"/>
      {inputRef.current?.value !== undefined && <FaTimes className="fill-gray-400 dark:hover:fill-gray-200 hover:fill-gray-700" onClick={handleClear}/>}
    </form>
  );
}
