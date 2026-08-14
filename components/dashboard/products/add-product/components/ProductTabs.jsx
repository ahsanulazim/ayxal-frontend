import { PRODUCT_FORM_STEPS } from "../constants/product-form.constants";

const ProductTabs = ({ activeStep, onStepChange }) => {
  return (
    <div role="tablist" className="tabs tabs-border border-b border-base-300">
      {PRODUCT_FORM_STEPS.map((step) => {
        const active = activeStep === step.id;
        return (
          <button
            key={step.id}
            role="tab"
            className={`tab ${active ? "tab-active" : ""}`}
            onClick={() => onStepChange(step.id)}
          >
            {step.label}
          </button>
        );
      })}
    </div>
  );
};

export default ProductTabs;
