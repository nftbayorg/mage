import React, { useCallback, useState } from "react";
import { RadioContext } from "../../../context/radioContext";
import { useRadioContext } from "../../../hooks/useRadioContext";

export type RadioButtonType = {
  children: React.ReactElement;
  position: "first" | "middle" | "last";
  value: string | number;
}

type RadioType = {
  defaultValue?: string | number;
  children: React.ReactElement | React.ReactElement[];
  onChange: (selectedValue: string | number) => void;
}

export const Radio = ({ children, defaultValue, onChange }: RadioType) => {

  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const updateSelectedValue = useCallback((value: any) => {
    setSelectedValue(value);
    onChange(value);
  }, [setSelectedValue, onChange]);

  return (
    <RadioContext.Provider value={{ selectedValue, changeSelectedValue: updateSelectedValue }}>
      <div className="flex">
        {children}
      </div>
    </RadioContext.Provider>
  );
}

export const RadioButton = ({ children, position, value }: RadioButtonType) => {
  const { selectedValue, changeSelectedValue } = useRadioContext();

  let rounded = position === "first" ? `rounded-l-lg rounded-r-none` : 'rounded-none';
  rounded = position === "last" ? 'rounded-l-none rounded-r-lg' : rounded;
  const isSelected = selectedValue === value;

  return (
    <div className={`flex flex-col items-center justify-center cursor-pointer p-3 border min-h-12 ${rounded} ${isSelected ? 'dark:bg-gray-500' : ''}`} onClick={() => changeSelectedValue(value)}>{children}</div>
  )
}
