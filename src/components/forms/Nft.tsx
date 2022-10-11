import { useForm } from "react-hook-form";
import Input from "./controls/Input";
import TextArea from "./controls/TextArea";
import { FaAsterisk } from "react-icons/fa";
import FileUpload from "./controls/FileUpload";
import { useCallback, useState } from "react";
import { Select } from "./controls/Select";
import { Option } from "./controls/Option";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../server/trpc/router";

type Collections = inferProcedureOutput<AppRouter["collection"]["getAll"]>;

type ComponentProps = {
  onSubmit: (data: CreateItemFormValues) => void;
  collections: Collections | undefined;
};

const NftForm = ({ onSubmit, collections }: ComponentProps) => {
  const [file, setFile] = useState<File>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateItemFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleFileUploadOnChange = useCallback((file: File | undefined) => {
    setFile(file);
  }, []);

  const onSubmitFormValues = async (data: CreateItemFormValues) => {
    if (file) {
      data.totalSupply = parseInt(data.totalSupply);
      data.file = file;
      onSubmit(data);
    }
  };

  return (
    <>
      <div className="flex items-center my-1">
        <FaAsterisk className="fill-red-500 mr-2" size={10} />
        <label className="text-sm text-gray-400">Required fields</label>
      </div>
      <FileUpload
        required={true}
        onChange={(file) => handleFileUploadOnChange(file)}
      />

      <form onSubmit={handleSubmit(onSubmitFormValues)}>
        <Input
          label="Name"
          name="name"
          placeholder="Item name"
          register={register}
          required
        />

        {collections && (
          <Select
            label="Collection"
            name="collectionId"
            placeholder="Place the NFT in a collection"
            register={register}
            setValue={setValue}
          >
            <>
              {collections.map((collection) => (
                <Option
                  key={collection.id}
                  value={[collection.id, collection.name]}
                >
                  {collection.name}
                </Option>
              ))}
            </>
          </Select>
        )}

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
          name="description"
          placeholder="Provide a detailed description of your item."
          register={register}
        />

        <Input
          label="Total supply"
          name="totalSupply"
          register={register}
          type="number"
          defaultValue={1}
          min={1}
          required
        />

        <button
          type="submit"
          disabled={!isValid || !file}
          className="flex items-center justify-center space-x-4 py-4 px-10 
            hover:bg-blue-400 bg-blue-500 rounded font-semibold 
            disabled:bg-blue-200
            dark:border
            dark:border-gray-300
            dark:bg-white dark:bg-opacity-0
            dark:hover:bg-opacity-10
            dark:disabled:bg-opacity-0
            text-white
            dark:disabled:text-gray-700
          "
        >
          <div>Create Item</div>
        </button>
      </form>
    </>
  );
};

export default NftForm;
