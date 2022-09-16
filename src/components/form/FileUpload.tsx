import { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import Image from "next/image";

import { DropZone } from "./DropZone";

interface FilePreview {
  url: string;
  file: File;
}

interface FileUploadEvent {
  onChange(hasFile: boolean): void
}

const FileUpload = ({ onChange }: FileUploadEvent) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDropActive, setIsDropActive] = useState(false);
  const [file, setFile] = useState<FilePreview>();

  useEffect(() => {
    onChange(file ? true : false);
  }, [file, onChange]);

  const onDragStateChange = useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive);
  }, []);
  const onFilesDrop = useCallback((files: File[]) => {
    if (files[0]) {
      setFile({ url: URL.createObjectURL(files[0]), file: files[0] });
    }
  }, []);

  const removeFile: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (file) {
      URL.revokeObjectURL(file?.url);
    }

    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }

    setFile(undefined);
  };

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (event.target.files) {
      const file = event?.target?.files[0];
      if (file) {
        setFile({ url: URL.createObjectURL(file), file: file });
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
      label="Image"
      required
      caption="File types supported: JPG, PNG, GIF, SVG"
      onDragStateChange={onDragStateChange}
      onFilesDrop={onFilesDrop}
    >
      <button
        onClick={onOpenFileDialog}
        className="flex items-center justify-center p-2 w-full h-96 md:w-96 border-4 border-dashed rounded-lg"
      >
        <input
          type="file"
          id="file"
          ref={inputRef}
          className="hidden"
          onChange={onFileSelected}
        />
        {file ? (
          <div className="w-full h-full relative">
            <div
              role="button"
              className="absolute top-3 right-3 z-10"
              onClick={removeFile}
            >
              <FaTimes className="fill-slate-400" />
            </div>
            <Image
              alt="image"
              objectFit="cover"
              layout="fill"
              className="rounded-lg block max-w-sm max-h-sm md:max-w-lg md:max-h-lg w-auto h-auto p-[inherit]"
              src={file.url}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center p-2 bg-gray-300 w-full h-full rounded-lg">
            <FaImage className="fill-gray-700" size={80} />
          </div>
        )}
      </button>
    </DropZone>
  );
};

export default FileUpload;
