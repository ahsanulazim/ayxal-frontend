"use client";

import React from "react";
import { LuCheck } from "react-icons/lu";

export default function StepperHeader({
  steps = [],
  activeStepIndex = 0,
  maxVisitedStepIndex = 0,
  onStepClick,
}) {
  const progressPercent = Math.round(
    (activeStepIndex / (steps.length - 1)) * 100
  );

  return (
    <div className="w-full bg-base-100 border border-base-300 rounded-3xl p-4 sm:p-6 shadow-xs">
      {/* Dynamic Progress Bar */}
      <div className="relative w-full h-1.5 bg-base-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stepper Node List */}
      <div className="flex justify-between items-start relative">
        {steps.map((step, index) => {
          const isCompleted = index < activeStepIndex;
          const isCurrent = index === activeStepIndex;
          const isClickable = index <= maxVisitedStepIndex && index !== activeStepIndex;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(index)}
              className={`flex flex-col items-center group relative text-center focus:outline-none transition-all duration-200 ${
                isClickable
                  ? "cursor-pointer hover:scale-105"
                  : isCurrent
                  ? "cursor-default"
                  : "cursor-not-allowed opacity-40"
              }`}
            >
              {/* Badge Circle */}
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm ${
                  isCurrent
                    ? "bg-primary text-primary-content ring-4 ring-primary/20 scale-105 shadow-md shadow-primary/20"
                    : isCompleted
                    ? "bg-success text-success-content hover:bg-success/90"
                    : "bg-base-200 text-base-content/60 border border-base-300"
                }`}
              >
                {isCompleted ? (
                  <LuCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Label & Description */}
              <div className="mt-2.5 hidden sm:block">
                <p
                  className={`text-xs sm:text-sm font-bold transition-colors ${
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                      ? "text-base-content"
                      : "text-base-content/50"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-base-content/40 hidden md:block max-w-[110px] truncate">
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
