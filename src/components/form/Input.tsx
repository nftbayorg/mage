import React, { InputHTMLAttributes } from "react";
import { FaAsterisk } from "react-icons/fa";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  caption?: string;
  name: string;
  label: string;
  register: any
}

const classes = "p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 font-normal text-xl focus:outline-none focus:border-gray-500";

const Input = ({ caption, name, label, required, register, ...rest }: InputProps) => (
  <div className="flex flex-col my-6">
    <div className="flex items-center my-1">
      <label className="text-xl" htmlFor={name}>{label}</label>
      {required ? <FaAsterisk className="fill-red-500 ml-2" size={10}/> : null}
    </div>
    {caption && <label className="mb-3 text-gray-400 text-sm">{caption}</label>}
    <input {...register(name, { required })} className={classes} id={name} {...rest}/>
  </div>
)

export default Input;