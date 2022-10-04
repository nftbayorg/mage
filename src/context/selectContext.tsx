import { createContext } from "react";

export const SelectContext = createContext<{
  selectedOption: any;
  changeSelectedOption: (option: { key: string, value: any }) => void;
}>({
  selectedOption: { key: "", value: "" },
  changeSelectedOption: (option: { key: string, value: any }) => {}
});
