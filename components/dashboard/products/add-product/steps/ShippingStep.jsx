const ShippingStep = ({ register, errors }) => {
  return (
    <div className="fieldset">
      <label htmlFor="weight" className="label">
        Package Weight (KG)
      </label>
      <input
        type="number"
        {...register("weight")}
        min={0.1}
        step={0.01}
        className="input w-full"
      />
      {errors.weight && (
        <span className="text-error text-sm">{errors.weight.message}</span>
      )}
      <label htmlFor="dimensions" className="label">
        Dimensions (IN)
      </label>
      <div className="flex gap-5">
        <input
          type="number"
          {...register("dimensions.length")}
          min={0.1}
          step={0.01}
          className="input w-full"
        />
        <input
          type="number"
          {...register("dimensions.width")}
          min={0.1}
          step={0.01}
          className="input w-full"
        />
        <input
          type="number"
          {...register("dimensions.height")}
          min={0.1}
          step={0.01}
          className="input w-full"
        />
      </div>
      <label htmlFor="freeShipping" className="label">
        <input
          type="checkbox"
          {...register("freeShipping")}
          className="checkbox checkbox-sm"
        />
        <span className="text-sm">Offer Free Shipping</span>
      </label>
    </div>
  );
};

export default ShippingStep;
