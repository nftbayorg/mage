import { FaTimes } from "react-icons/fa";

type OverlayPanelProps = {
  children: React.ReactElement;
  caption?: string;
  visible: boolean;
  onClose?: () => void;
}

export const OverlayPanel = ({ caption, children, onClose, visible }: OverlayPanelProps) => {

  return (
    <div className={`
      fixed
      flex flex-col gap-5
      w-full
      transition-all 
      ease-in-out delay-150 duration-500
      overflow-y-scroll
      bg-white
      dark:bg-gray-900
      p-6
      ${visible ? 'h-full' : 'h-0'}
      ${visible ? 'top-0' : 'top-[100%]'}
      z-[100000]`
    }>
      <div className="flex items-center justify-center w-full">
        <div className="ml-auto text-gray-800 dark:text-gray-200 text-xl">{caption}</div>
        <button className="ml-auto" onClick={onClose}>
          <FaTimes size={30}/>
        </button>
      </div>
      <hr className="border border-gray-200" />
      {children}
    </div>
  )
}
