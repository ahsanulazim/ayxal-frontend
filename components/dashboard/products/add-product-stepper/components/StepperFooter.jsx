"use client";

import React from "react";
import { LuArrowLeft, LuArrowRight, LuCheck, LuBookmarkCheck, LuTrash } from "react-icons/lu";

export default function StepperFooter({
  isFirstStep = true,
  isLastStep = false,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting = false,
  lastSavedTime = null,
  onClearDraft,
  onSaveDraftManual,
  submitText = "Publish Product",
  submittingText = "Publishing...",
  isEditMode = false,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-base-300">
      {/* Left Action: Previous & Clear Draft */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrev}
            disabled={isSubmitting}
            className="btn btn-outline btn-sm sm:btn-md gap-2 rounded-xl"
          >
            <LuArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        <button
          type="button"
          onClick={onClearDraft}
          disabled={isSubmitting}
          className="btn btn-ghost btn-xs text-base-content/50 hover:text-error hover:bg-error/10 gap-1 rounded-lg"
          title="Clear saved draft data"
        >
          <LuTrash className="w-3.5 h-3.5" /> Clear Draft
        </button>
      </div>

      {/* Center: Draft Status */}
      <div className="text-xs text-base-content/60 flex items-center gap-1.5 order-last sm:order-none">
        <LuBookmarkCheck className="text-success w-3.5 h-3.5" />
        {lastSavedTime ? (
          <span>Draft auto-saved at {lastSavedTime}</span>
        ) : (
          <span>Draft auto-saves automatically</span>
        )}
      </div>

      {/* Right Action: Next or Submit */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {!isLastStep ? (
          <button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            className="btn btn-primary btn-sm sm:btn-md gap-2 rounded-xl px-6 shadow-md shadow-primary/20 w-full sm:w-auto"
          >
            Next Step <LuArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="btn btn-success text-success-content btn-sm sm:btn-md gap-2 rounded-xl px-8 shadow-md shadow-success/20 w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm" /> {submittingText}
              </>
            ) : (
              <>
                <LuCheck className="w-4 h-4 stroke-[3]" /> {submitText}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
