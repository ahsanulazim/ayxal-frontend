const ProductFormFooter = ({
  isFirstStep,
  isLastStep,
  goBack,
  goNext,
  submitting,
}) => {
  return (
    <div className="flex justify-end gap-4 mt-6">
      {!isFirstStep && (
        <button type="button" onClick={goBack} className="btn">
          Back
        </button>
      )}

      <button
        type="button"
        onClick={goNext}
        className={`btn ${isLastStep ? "btn-error" : "btn-success"}`}
        disabled={submitting}
      >
        {submitting ? (
          <>
            <span className="loading loading-spinner"></span>Submitting
          </>
        ) : isLastStep ? (
          "Submit"
        ) : (
          "Next"
        )}
      </button>
    </div>
  );
};

export default ProductFormFooter;
