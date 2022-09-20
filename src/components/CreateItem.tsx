import { useForm } from "react-hook-form";
import Input from "../components/form/Input";
import TextArea from "../components/form/TextArea";
import { FaAsterisk } from "react-icons/fa";
import FileUpload from "./form/FileUpload";
import { useCallback, useState } from "react";

type ComponentProps = {
  onSubmit: (data: CreateItemFormValues) => void;
}

const CreateItem = ({ onSubmit }: ComponentProps) => {

  const [file, setFile] = useState<File>();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateItemFormValues>({
    mode: "onChange",
    reValidateMode: "onChange" 
  });

  const handleFileUploadOnChange = useCallback((file: File | undefined) => {
    setFile(file);
  }, [])
 
  const onSubmitFormValues = async (data: CreateItemFormValues) => {
    if (file) {
      data.file = file;
      onSubmit(data);
    }
  }

  return (
    <>
      <div className="flex items-center my-1">
        <FaAsterisk className="fill-red-500 mr-2" size={10}/>
        <label className="text-sm text-gray-400">Required fields</label>
      </div>
      <FileUpload onChange={(file) => handleFileUploadOnChange(file)}/>

      <form onSubmit={handleSubmit(onSubmitFormValues)}>
        <Input
          label="Name"
          name="name"
          placeholder="Item name"
          register={register}
          required
        />

        <Input
          caption="Mage will include a link on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details."
          label="External link"
          name="link"
          placeholder="https://yoursite.io/item/123"
          register={register}
        />

        <TextArea    
          caption="The description will be included on your item's detail page underneath its image."
          label="Description"
          name="descrioption"    
          placeholder="Provide a detailed description of your item."
          register={register}
        />

        <button type="submit" disabled={!isValid || !file} className="flex items-center justify-center space-x-4 py-4 px-10 hover:bg-blue-400 bg-blue-500 rounded font-semibold disabled:bg-blue-200">
          <div className="text-white">Create Item</div>
        </button>
      </form>
    </>
  );
};

export default CreateItem;