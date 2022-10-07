import { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import Image from "next/image";

import { DropZone } from "./DropZone";

interface FilePreview {
  url: string;
  file: File;
}

type ComponentProps = {
  label?: string;
  caption?: string;
  captionSize?: "sm" | "md" | "lg";
  dropZoneSize?: "sm" | "md" | "lg";
  onChange(file?: File): void;
}


const FileUpload = ({ onChange, label, caption, captionSize, dropZoneSize }: ComponentProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [dropzoneDimensions, setDropzoneDimensions] = useState<string>("w-full h-96 md:w-96");
  const [roundedDimensions, setRoundedDimensions] = useState<string>("rounded-lg");
  const [insetBgColor, setInsetBgColor] = useState<string>("bg-gray-300 dark:bg-gray-700");
  const [insetIconFillColor, setInsetIconFillColor] = useState<string>("fill-gray-700");
  const [buttonBorderColor, setButtonBorderColor] = useState<string>("");
  const [isMouseOver, setMouseOver] = useState<boolean>(false);
  const [isDropActive, setIsDropActive] = useState(false);
  const [filePreview, setFilePreview] = useState<FilePreview>();

  useEffect(() => {
    onChange(filePreview?.file);
  }, [filePreview, onChange]);

  useEffect(() => {
    switch (dropZoneSize) {
      case "sm":
        setDropzoneDimensions("h-64 w-64");
        setRoundedDimensions("rounded-full");
        break;
      case "lg":
        setDropzoneDimensions("w-full h-72");
        break;
      default:
        break;
    }
  }, [dropZoneSize]);

  useEffect(() => {
    if (isMouseOver) {
      setInsetBgColor("bg-gray-300");
      setInsetIconFillColor("fill-gray-700");
      setButtonBorderColor("border-gray-400");
    } else {
      setInsetBgColor("bg-gray-300 dark:bg-neutral-700");
      setInsetIconFillColor("fill-gray-300");
      setButtonBorderColor("");
    }
  }, [isMouseOver])

  const onDragStateChange = useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive);
  }, []);
  const onFilesDrop = useCallback((files: File[]) => {
    if (files[0]) {
      setFilePreview({ url: URL.createObjectURL(files[0]), file: files[0] });
    }
  }, []);

  const removeFile: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (filePreview) {
      URL.revokeObjectURL(filePreview?.url);
    }

    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }

    setFilePreview(undefined);
  };

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (event.target.files) {
      const file = event?.target?.files[0];
      if (file) {
        setFilePreview({ url: URL.createObjectURL(file), file: file });
      }
    }
  };

  const onOpenFileDialog = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };


  return (
    <DropZone
      name="drop"
      label={label || "Image"}
      required
      caption={caption || "File types supported: JPG, PNG, GIF, AVIF, WEBP"}
      captionSize={captionSize || "sm"}
      onDragStateChange={onDragStateChange}
      onFilesDrop={onFilesDrop}
    >
      <button
        onClick={onOpenFileDialog}
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        className={`flex items-center justify-center p-2 border-4 border-dashed ${buttonBorderColor} ${dropzoneDimensions} ${roundedDimensions}`}
      >
        <input
          type="file"
          id="file"
          ref={inputRef}
          className="hidden"
          onChange={onFileSelected}
        />
        {filePreview ? (
          <div className="w-full h-full relative">
            {dropZoneSize !== "sm" && 
              <div
                role="button"
                className="absolute z-10 top-3 right-3"
                onClick={removeFile}
              >
                <FaTimes className="fill-slate-400" />
              </div>
            } 
            <Image
              alt="image"
              objectFit="cover"
              layout="fill"
              className={`block max-w-sm max-h-sm md:max-w-lg md:max-h-lg w-auto h-auto p-[inherit] ${roundedDimensions}`}
              src={filePreview.url}
            />
          </div>
        ) : (
          <div className={`flex items-center justify-center p-2 w-full h-full ${roundedDimensions} ${insetBgColor}`}>
            <FaImage className={insetIconFillColor} size={80} />
          </div>
        )}
      </button>
    </DropZone>
  );
};

export default FileUpload;
