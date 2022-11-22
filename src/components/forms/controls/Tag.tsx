import { useCallback } from "react";
import { FaTimes } from "react-icons/fa";

type TagProps = {
  caption: string;
  closable?: boolean;
  onClose?: () => void;
}

export const Tag = ({ caption, closable, onClose }: TagProps) => {

  const handleClose = useCallback(() => {
    if (closable && onClose) onClose();
  }, [closable, onClose]);

  return (
    <div 
      className="flex items-center justify-center gap-5 w-fit bg-gray-300 dark:bg-slate-700 rounded-lg p-3" 
    >
      <div className="whitespace-nowrap">{caption}</div>
      {closable && <FaTimes className="cursor-pointer" onClick={() => handleClose()}/>}
    </div>
  )
}
