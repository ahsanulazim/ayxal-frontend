"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

const StepperValidationContext = createContext({
  stepErrors: {},
  setStepErrors: () => {},
  clearFieldError: () => {},
  clearAllErrors: () => {},
});

export function StepperValidationProvider({ children }) {
  const [stepErrors, setStepErrors] = useState({});

  const clearFieldError = useCallback((fieldName) => {
    if (!fieldName) return;
    setStepErrors((prev) => {
      if (!prev[fieldName]) {
        // Also check dot / bracket variations
        const normalized = fieldName.replace(/\[(\d+)\]/g, ".$1");
        const bracketed = fieldName.replace(/\.(\d+)/g, "[$1]");
        if (!prev[normalized] && !prev[bracketed]) return prev;
        const next = { ...prev };
        delete next[normalized];
        delete next[bracketed];
        return next;
      }
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setStepErrors({});
  }, []);

  return (
    <StepperValidationContext.Provider
      value={{
        stepErrors,
        setStepErrors,
        clearFieldError,
        clearAllErrors,
      }}
    >
      {children}
    </StepperValidationContext.Provider>
  );
}

export function useStepperValidation() {
  return useContext(StepperValidationContext);
}
