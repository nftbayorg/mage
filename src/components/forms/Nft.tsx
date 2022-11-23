import { useForm } from "react-hook-form";
import Input from "./controls/Input";
import TextArea from "./controls/TextArea";
import { FaAsterisk, FaList } from "react-icons/fa";
import FileUpload from "./controls/FileUpload";
import { useCallback, useEffect, useState } from "react";
import { Select } from "./controls/Select";
import { Option } from "./controls/Option";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../server/trpc/router";
import { CollapsePanel } from "./controls/CollapsePanel";
import NftPropertiesForm from "./NftProperties";
import { nanoid } from 'nanoid'

type Collections = inferProcedureOutput<AppRouter["collection"]["getAll"]>;

type ComponentProps = {
  onSubmit: (data: CreateItemFormValues) => void;
  collections: Collections | undefined;
  defaultCollection: Collections[0] | undefined;
};

const NftForm = ({ onSubmit, collections, defaultCollection }: ComponentProps) => {
  const [file, setFile] = useState<File>();
  const [properties, setProperties] = useState<CreateItemPropertyFormValues[]>();
  
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
      data.properties = properties;
      onSubmit(data);
    }
  };

  const onSubmitPropertyFormValues = async (data: CreateItemPropertyFormValues) => {
    setProperties(prev => {
      return prev ? [...prev, {...data, id: nanoid()} ] : [{...data, id: nanoid() }];
    });
  };

  const removeProperty = (property: CreateItemPropertyFormValues) => {
    setProperties(prev => prev?.filter(p => p.id !== property.id));
  }

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

      <form>
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
            initialValue={defaultCollection && { key: defaultCollection?.id, value: defaultCollection?.name }}
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


      </form>
      <CollapsePanel
        label="Properties"
        collapsible={true}
        icon={<FaList size={25} className="fill-gray-700 dark:fill-gray-200"/>}
      >
        <div className="flex flex-col gap-5 w-full">
          <div className="text-xl font-normal">
            Properties show up underneath your item, are clickable, and can be filtered in your collection&apos;s sidebar
          </div>

          <div className="w-full flex flex-col">
            <>
              <NftPropertiesForm onSubmit={onSubmitPropertyFormValues} />
            </>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 w-full gap-2 flex-wrap">
            {properties && properties.map((property, idx) => (
              <div className="border border-blue-300 bg-blue-50 dark:bg-gray-700 w-full md:w-64 h-24 flex flex-col items-center justify-center gap-1 rounded-lg relative overflow-hidden" key={idx}>
                <div className="text-blue-400 text-md absolute right-2 top-1 p-1 cursor-pointer hover:text-blue-600" onClick={() => removeProperty(property)}>X</div>
                <div className="text-blue-400 text-xs w-full text-ellipsis whitespace-nowrap text-center px-1 overflow-hidden">{property.type}</div>
                <div className="text-gray-700 dark:text-gray-200 text-base w-full text-ellipsis overflow-hidden whitespace-nowrap text-center px-1">{property.name}</div>
              </div>
            ))}
          </div>
        </div>
      </CollapsePanel>
      <button
        onClick={handleSubmit(onSubmitFormValues)}
        disabled={!isValid || !file}
        className="flex items-center justify-center space-x-4 py-4 px-10 w-fit
          hover:bg-blue-400 bg-blue-500 rounded font-semibold 
          disabled:bg-blue-200
          dark:border
          dark:border-gray-300
          dark:bg-white dark:bg-opacity-0
          dark:hover:bg-opacity-10
          dark:disabled:bg-opacity-0
          text-white
          dark:disabled:text-gray-700
          mt-10
        "
      >
        <div>Create Item</div>
      </button>
    </>
  );
};

export default NftForm;
