import { useForm } from "react-hook-form";
import Input from "./controls/Input";
import TextArea from "./controls/TextArea";
import { FaAsterisk } from "react-icons/fa";
import FileUpload from "./controls/FileUpload";
import { useCallback, useState } from "react";

type ComponentProps = {
  onSubmit: (data: CreateItemFormValues) => void;
}

const CreateCollection = ({ onSubmit }: ComponentProps) => {

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
      data.totalSupply = parseInt(data.totalSupply);
      data.file = file;
      onSubmit(data);
    }
  }

  return (
    <div className="w-full md:w-4/5">
      <div className="flex items-center my-1">
        <FaAsterisk className="fill-red-500 mr-2" size={10}/>
        <label className="text-sm text-gray-400">Required fields</label>
      </div>
      <FileUpload onChange={(file) => handleFileUploadOnChange(file)}/>

      <form className="w-full"  onSubmit={handleSubmit(onSubmitFormValues)}>
        <Input
          label="Name"
          name="name"
          placeholder="Example: All things equal"
          register={register}
          required
        />

        <TextArea    
          caption="The description will be included on your collection page underneath its image."
          label="Description"
          name="description"    
          placeholder="Provide a detailed description of your collection."
          register={register}
        />


        <button type="submit" disabled={!isValid || !file} className="flex items-center justify-center space-x-4 py-4 px-10 hover:bg-blue-400 bg-blue-500 rounded font-semibold disabled:bg-blue-200">
          <div className="text-white">Create</div>
        </button>
      </form>
    </div>
  );
};

export default CreateCollection;
