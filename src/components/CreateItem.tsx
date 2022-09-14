import { useForm } from "react-hook-form";
import Input from "../components/form/Input";

const CreateItem = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: Object) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        required
        label="Name"
        placeholder="Item name"
        caption="Some other text about the input to make the user understand"
        {...register("name", { required: true })}
      />

      <button className="flex items-center justify-center space-x-4 py-4 px-10 hover:bg-blue-400 bg-blue-500 rounded font-semibold">
        <div className="text-white">Create Item</div>
      </button>
      {errors.name && <span>This field is required</span>}
    </form>
  );
};

export default CreateItem;
