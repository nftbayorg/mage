import { useForm } from "react-hook-form";
import Input from "./controls/Input";
import TextArea from "./controls/TextArea";
import { FaAsterisk } from "react-icons/fa";
import FileUpload from "./controls/FileUpload";
import { useCallback, useState } from "react";

type ComponentProps = {
  onSubmit: (data: CreateCollectionFormValues) => void;
}

const CollectionForm = ({ onSubmit }: ComponentProps) => {

  const [logoImageFile, setLogoImageFile] = useState<File>();
  const [featuredImageFile, setFeaturedImageFile] = useState<File>();
  const [bannerImageFile, setBannerImageFile] = useState<File>();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateCollectionFormValues>({
    mode: "onChange",
    reValidateMode: "onChange" 
  });

  const handleLogoImageUploaded = useCallback((file: File | undefined) => {
    setLogoImageFile(file);
  }, []);

  const handleFeaturedImageUploaded = useCallback((file: File | undefined) => {
    setFeaturedImageFile(file);
  }, []);

  const handleBannerImageUploaded = useCallback((file: File | undefined) => {
    setBannerImageFile(file);
  }, []);
 
  const onSubmitFormValues = async (data: CreateCollectionFormValues) => {
    if (logoImageFile) {
      data.logoImageFile = logoImageFile;
      data.featuredImageFile = featuredImageFile;
      data.bannerImageFile = bannerImageFile;
      onSubmit(data);
    }
  }

  return (
    <div className="w-full h-full">
      <div className="flex items-center my-1">
        <FaAsterisk className="fill-red-500 mr-2" size={10}/>
        <label className="text-sm text-gray-400">Required fields</label>
      </div>
      <FileUpload 
        label="Logo image" 
        caption ="This image will also be used for navigation. 350 x 350 recommended." 
        captionSize="md" 
        dropZoneSize="sm"
        onChange={(file) => handleLogoImageUploaded(file)}
      />
      <FileUpload 
        label="Featured image" 
        caption="This image will be used for featuring your collection on the homepage, category pages, or other promotional areas of Mage. 600 x 400 recommended." 
        captionSize="md" 
        onChange={(file) => handleFeaturedImageUploaded(file)}
      />
      <FileUpload 
        label="Banner image" 
        caption="This image will appear at the tap of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 350 recommended."
        captionSize="md"
        dropZoneSize="lg"
        onChange={(file) => handleBannerImageUploaded(file)}
      />

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

        <button type="submit" disabled={!isValid || !logoImageFile} className="flex items-center justify-center space-x-4 py-4 px-10 hover:bg-blue-400 bg-blue-500 rounded font-semibold disabled:bg-blue-200">
          <div className="text-white">Create</div>
        </button>
      </form>
    </div>
  );
};

export default CollectionForm;
