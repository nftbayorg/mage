import { useEffect, useRef, useState } from "react";

type CheckBoxProps = {
  onClick?: () => void;
  initialValue: boolean;
}

export const Checkbox = ({ onClick, initialValue }: CheckBoxProps) => {

  const [checked, setChecked] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setChecked(initialValue);

    if (inputRef.current) {
      inputRef.current.checked = initialValue;
    }
  }, [initialValue]);

  const handleClick = () => {
    setChecked(prev => !prev);

    if (onClick) onClick();
  }

  return (
    <div className="">  
      <div className="flex items-center mr-4 px-1" onClick={handleClick}>  
        <input ref={inputRef} type="checkbox" id="A3-yes" name="A3-confirmation" className="opacity-0 absolute h-8 w-8" />  
        <div className={`border-2 rounded-md  ${checked ? 'border-blue-500 dark:border-blue-500' : 'border-gray-500 dark:border-gray-400'} w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500`}>  
          <svg className="fill-current hidden bg-blue-500 w-5 h-5 p-1 text-white pointer-events-none" version="1.1" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">  
            <g fill="none" fillRule="evenodd">  
              <g transform="translate(-9 -11)" fill="#ffffff" fillRule="nonzero">  
                <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />  
              </g>  
            </g>  
          </svg>  
        </div>  
      </div>  
    </div>
  );
}
