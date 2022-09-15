import { useForm } from "react-hook-form";
import Input from "../components/form/Input";
import TextArea from "../components/form/TextArea";
import { DropZone } from "../components/form/DropZone";
import { MouseEventHandler, useCallback, useRef, useState } from "react";
import { FaImage, FaAsterisk, FaTimes } from "react-icons/fa";
import Image from "next/image";

interface FilePreview {
  url: string;
  file: File
}

const CreateItem = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: Object) => console.log(data);

  const [isDropActive, setIsDropActive] = useState(false)
  const [file, setFile] = useState<FilePreview>()

  const onDragStateChange = useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive);
  }, [])
  const onFilesDrop = useCallback((files: File[]) => {
    if (files[0]) {
      setFile({ url: URL.createObjectURL(files[0]), file: files[0] })
    }
  }, [])

  const removeFile: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (file) {
      URL.revokeObjectURL(file?.url);
    }

    if (inputRef && inputRef.current) {
      inputRef.current.value = '';
    }

    setFile(undefined);
  }

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (event.target.files) {
      const file = event?.target?.files[0];
      if (file) {
        setFile({ url: URL.createObjectURL(file), file: file })
      }
    }
  }

  const onOpenFileDialog = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  }

  return (
    <>
      <div className="flex items-center my-1">
        <FaAsterisk className="fill-red-500 mr-2" size={10}/>
        <label className="text-sm text-gray-400">Required fields</label>
      </div>

      <DropZone
        name="drop"
        label="Image"
        required
        caption="File types supported: JPG, PNG, GIF, SVG"
        onDragStateChange={onDragStateChange}
        onFilesDrop={onFilesDrop}
      >
        <button onClick={onOpenFileDialog} className="flex items-center justify-center p-2 w-full h-96 md:w-96 border-4 border-dashed rounded-lg">
          <input type="file" id="file" ref={inputRef} className="hidden" onChange={onFileSelected}/>
          {file ?
            <div className="w-full h-full relative">
              <div role="button" className="absolute top-3 right-3 z-10" onClick={removeFile}>
                <FaTimes className="fill-slate-400" />
              </div>
              <Image alt="image" objectFit="cover" layout="fill" className="rounded-lg block max-w-sm max-h-sm md:max-w-lg md:max-h-lg w-auto h-auto p-[inherit] p-2" src={file.url}/>
            </div>
            : 
            <div className="flex items-center justify-center p-2 bg-gray-300 w-full h-full rounded-lg">
              <FaImage className="fill-gray-700" size={80}/>
            </div>
          }
        </button>

      </DropZone>      

      <form onSubmit={handleSubmit(onSubmit)}>

        <Input
          required
          label="Name"
          placeholder="Item name"
          {...register("name", { required: true })}
        />

        <Input
          label="External link"
          placeholder="https://yoursite.io/item/123"
          caption="Mage will include a link on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details."
          {...register("link")}
        />

        <TextArea        
          label="Description"
          placeholder="Provide a detailed description of your item."
          caption="The description will be included on your item's detail page underneath its image."
          {...register("link")}
        />

        <button className="flex items-center justify-center space-x-4 py-4 px-10 hover:bg-blue-400 bg-blue-500 rounded font-semibold">
          <div className="text-white">Create Item</div>
        </button>
        {/* {errors.name && <span>This field is required</span>} */}
      </form>
    </>
  );
};

export default CreateItem;
