import { useForm } from "react-hook-form";
import Input from "../components/form/Input";
import TextArea from "../components/form/TextArea";

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
