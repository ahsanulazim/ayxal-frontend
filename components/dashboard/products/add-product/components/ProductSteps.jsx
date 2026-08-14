import { LuCheck, LuInfo } from "react-icons/lu";
import { PRODUCT_FORM_STEPS } from "../constants/product-form.constants";

const ProductSteps = ({ activeStep }) => {
  const activeIndex = PRODUCT_FORM_STEPS.findIndex(
    (step) => step.id === activeStep,
  );

  return (
    <ul className="steps steps-horizontal">
      {PRODUCT_FORM_STEPS.map((step, index) => {
        const isCompleted = index <= activeIndex;
        return (
          <li
            key={step.id}
            className={`step ${isCompleted ? "step-success" : ""} `}
          >
            <span className="step-icon">
              {index < activeIndex ? (
                <LuCheck />
              ) : index === activeIndex ? (
                <LuInfo />
              ) : (
                ""
              )}
            </span>
            <div>
              <h1 className="text-sm">{step.label}</h1>
              <p className="text-xs opacity-50">
                {index < activeIndex
                  ? "Completed"
                  : index === activeIndex
                    ? "Active"
                    : "Pending"}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ProductSteps;
