import { createContext } from "react";

export const RadioContext = createContext<{
  selectedValue: any;
  changeSelectedValue: (value: any) => void;
}>({
  selectedValue: undefined,
  changeSelectedValue: (value: any) => {}
});
