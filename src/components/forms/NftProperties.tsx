import { useForm } from "react-hook-form";
import Input from "./controls/Input";

type ComponentProps = {
  onSubmit: (data: CreateItemPropertyFormValues) => void;
};

const NftPropertiesForm = ({ onSubmit }: ComponentProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateItemPropertyFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmitFormValues = async (data: CreateItemPropertyFormValues) => {
    data.name = data.name.toLocaleUpperCase();
    data.type = data.type.toLocaleUpperCase();
    onSubmit(data);
    reset();
  };

  return (
    <>
      <form className="w-full" onSubmit={handleSubmit(onSubmitFormValues)}>
         <div className="flex flex-col md:flex-row md:gap-1 w-full">
          <Input
            label="Type"
            name="type"
            placeholder="Character"
            required={true}
            register={register}
          />
          <Input
            label="Name"
            name="name"
            placeholder="Male"
            required={true}
            register={register}
          />
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="flex items-center justify-center space-x-4 my-5 py-4 px-10 w-full md:w-fit
            hover:bg-blue-400 bg-blue-500 rounded font-semibold 
            disabled:bg-blue-200
            dark:border
            dark:border-gray-300
            dark:bg-white dark:bg-opacity-0
            dark:hover:bg-opacity-10
            dark:disabled:bg-opacity-0
              text-white
            dark:disabled:text-gray-900
          "
        >
          <div>Add Property</div>
        </button>
      </form>
    </>
  );
};

export default NftPropertiesForm;
