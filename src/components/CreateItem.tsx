import { useForm } from "react-hook-form";
import Input from "../components/form/Input";
import TextArea from "../components/form/TextArea";
import { DropZone } from "../components/form/DropZone";
import { FileList } from "../components/form/FileList";
import { useCallback, useState } from "react";
import { FaImage, FaAsterisk, FaTimes } from "react-icons/fa";

interface FilePreview {
  url: string;
  file: File
}

const CreateItem = () => {
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

  console.log("files", file);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        {!file && 
          <div className="flex items-center justify-center p-2 w-full h-96 md:w-96 border-4 border-dashed rounded-lg">
            <div className="flex items-center justify-center bg-gray-300 w-full h-full rounded-lg">
              <FaImage className="fill-gray-700" size={80}/>
            </div>
          </div>
        }

        {file && 
          <div className="rounded-lg border-4 border-dashed p-2 flex items-center justify-center h-auto w-auto relative">
            <button className="absolute top-3 right-3">
              <FaTimes className="fill-slate-400" />
            </button>
            <div className="h-auto w-auto p-8">
              <img width={600} height={600} className="rounded block max-w-sm max-h-sm md:max-w-lg md:max-h-lg w-auto h-auto" src={file.url}/>
            </div>
          </div>
        }
      </DropZone>      

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
      {errors.name && <span>This field is required</span>}
    </form>
  );
};

export default CreateItem;
