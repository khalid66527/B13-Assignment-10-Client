"use client";

import React, { createContext, useContext, useState } from "react";

const AICuratorContext = createContext();

export function AICuratorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState(null);

  const openCurator = (prompt = null) => {
    if (prompt) setInitialPrompt(prompt);
    setIsOpen(true);
  };

  const closeCurator = () => {
    setIsOpen(false);
  };

  const toggleCurator = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <AICuratorContext.Provider
      value={{
        isOpen,
        openCurator,
        closeCurator,
        toggleCurator,
        initialPrompt,
        setInitialPrompt
      }}
    >
      {children}
    </AICuratorContext.Provider>
  );
}

export function useAICurator() {
  const context = useContext(AICuratorContext);
  if (!context) {
    throw new Error("useAICurator must be used within an AICuratorProvider");
  }
  return context;
}
