"use client";

import React, { useState } from "react";
import { LuTerminal, LuX, LuSparkles, LuCopy, LuCheck } from "react-icons/lu";
import { toast } from "react-toastify";
import { useFormStore } from "../form/productFormHook";

export default function FormDebugDrawer({ form, activeStep, onFillDummyData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Subscribe to form state
  const formState = useFormStore(form, (state) => ({
    values: state.values,
    errors: state.errors,
    isSubmitting: state.isSubmitting,
    isDirty: state.isDirty,
    isValidating: state.isValidating,
  }));

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(formState.values, null, 2));
    setCopied(true);
    toast.success("Form values JSON copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-neutral btn-sm shadow-xl border border-base-content/20 gap-2 rounded-full font-mono text-xs hover:btn-primary transition-all duration-200"
        >
          <LuTerminal className="w-4 h-4 text-primary" />
          <span>Form Debugger</span>
          <span className="badge badge-xs badge-primary">{activeStep}</span>
        </button>
      </div>

      {/* Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-base-100 border-l border-base-300 shadow-2xl z-50 flex flex-col font-sans animate-slideIn">
          {/* Drawer Header */}
          <div className="p-4 border-b border-base-300 flex items-center justify-between bg-base-200/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <LuTerminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-base-content">
                  TanStack Form Inspector
                </h3>
                <p className="text-[11px] text-base-content/50">
                  Real-time reactive state debugging
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <LuX className="w-4 h-4" />
            </button>
          </div>

          {/* Developer Quick Actions */}
          <div className="p-3 bg-base-200/30 border-b border-base-300 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onFillDummyData}
              className="btn btn-outline btn-primary btn-xs flex-1 gap-1"
            >
              <LuSparkles className="w-3 h-3" /> Auto-fill Sample Data
            </button>
            <button
              type="button"
              onClick={handleCopyJson}
              className="btn btn-ghost btn-xs gap-1"
            >
              {copied ? <LuCheck className="w-3 h-3 text-success" /> : <LuCopy className="w-3 h-3" />}
              Copy JSON
            </button>
          </div>

          {/* State Summary Badges */}
          <div className="p-3 border-b border-base-300 grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-base-200 p-2 rounded-lg">
              <span className="text-base-content/50 block text-[10px] uppercase">
                Active Step
              </span>
              <span className="font-bold text-primary">{activeStep}</span>
            </div>
            <div className="bg-base-200 p-2 rounded-lg">
              <span className="text-base-content/50 block text-[10px] uppercase">
                Is Dirty
              </span>
              <span className={`font-bold ${formState.isDirty ? "text-warning" : "text-success"}`}>
                {formState.isDirty ? "Yes (Modified)" : "No (Pristine)"}
              </span>
            </div>
          </div>

          {/* Form Values JSON Viewer */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs bg-base-300/30">
            <div className="mb-2 text-[10px] font-bold uppercase text-base-content/50 tracking-wider">
              Reactive Form Values:
            </div>
            <pre className="p-3 rounded-xl bg-base-100 border border-base-300 text-base-content overflow-x-auto text-[11px] leading-relaxed">
              {JSON.stringify(formState.values, null, 2)}
            </pre>

            {formState.errors && formState.errors.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 text-[10px] font-bold uppercase text-error tracking-wider">
                  Errors ({formState.errors.length}):
                </div>
                <pre className="p-3 rounded-xl bg-error/10 border border-error/20 text-error overflow-x-auto text-[11px]">
                  {JSON.stringify(formState.errors, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
