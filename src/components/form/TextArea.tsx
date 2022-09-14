import React, { InputHTMLAttributes } from "react";
import { FaAsterisk } from "react-icons/fa";

interface InputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  caption?: string;
  name: string;
  label: string;
}

const classes = "p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 font-normal text-xl focus:outline-none focus:border-gray-500";

const TextArea = React.forwardRef<HTMLTextAreaElement, InputProps>(({ caption, name, label, required, ...rest }, ref) => (
    <div className="flex flex-col my-6">
      <div className="flex items-center my-1">
        <label className="text-xl" htmlFor={name}>{label}</label>
        {required ? <FaAsterisk className="fill-red-500 ml-2" size={10}/> : null}
      </div>
      {caption && <label className="mb-3 text-gray-400 text-sm">{caption}</label>}
      <textarea ref={ref} cols={1} rows={5} className={classes} id={name} {...rest}></textarea>
    </div>
))

TextArea.displayName = "input";

export default TextArea;