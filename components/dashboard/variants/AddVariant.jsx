"use client";
import { log } from "firebase/firestore/pipelines";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";

const AddVariant = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="">
      <h2 className="text-lg font-bold">Add New Variant</h2>
      <form
        className="fieldset bg-base-100 p-5 rounded-box mt-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="name" className="label">
          Name
        </label>
        <input
          type="text"
          placeholder="Color"
          className="input w-full"
          {...register("name", { required: "Variation Name is Required" })}
        />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        <label htmlFor="type" className="label">
          Type
        </label>
        <select
          defaultValue=""
          className="select w-full"
          {...register("type", { required: "Type is required" })}
        >
          <option value="" disabled={true}>
            Select a Type
          </option>
          <option value="color">Color</option>
          <option value="button">Button</option>
        </select>
        {errors.type && <p className="text-red-600">{errors.type.message}</p>}
        <button type="submit" className="mt-5 btn btn-main">
          <LuPlus /> Add Variant
        </button>
      </form>
    </div>
  );
};

export default AddVariant;
