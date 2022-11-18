type ButtonProps = {
  caption: string;
  onClick?: () => void;
  icon?: React.ReactElement;
}

export const Button = ({ caption, icon, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center space-x-4 my-5 py-4 px-10 w-full md:w-fit
        bg-white rounded font-semibold 
        focus:bg-white
        disabled:bg-blue-200
        border
        border-gray-300
        dark:border-gray-300
        dark:bg-gray-800
        dark:focus:bg-gray-800
        dark:hover:bg-opacity-10
        dark:disabled:bg-opacity-0

        text-gray-800
        dark:text-white
        dark:disabled:text-gray-900
      "
    >
      {icon}
      <div>{caption}</div>
    </button>

  )
}