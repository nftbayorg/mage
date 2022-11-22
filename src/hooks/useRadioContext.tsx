import { useContext } from "react";
import { RadioContext } from "../context/radioContext";

export const useRadioContext = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error("Error in creating the context");
  }
  return context;
};
