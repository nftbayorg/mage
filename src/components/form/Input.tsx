import React, { InputHTMLAttributes } from "react";
import { FaAsterisk } from "react-icons/fa";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ name, label, required, ...rest }, ref) => (
    <div className="flex flex-col my-4">
      <div className="flex items-center m-1">
        {required ? <FaAsterisk className="fill-red-500 mr-2" size={10}/> : null}
        <label className="text-sm" htmlFor={name}>{label}</label>
      </div>
      <input ref={ref} className="p-4 rounded border border-gray-200 dark:border-gray-600 font-normal text-xl" id={name} {...rest}/>
    </div>
))

Input.displayName = "input";

export default Input;