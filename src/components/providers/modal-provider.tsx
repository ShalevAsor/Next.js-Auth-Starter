"use client";

import { useState, useEffect } from "react";
import { SettingsModal } from "@/components/modals/settings-modal";

export const ModalProvider = () => {
  // State to track if component is mounted
  const [isMounted, setIsMounted] = useState(false);

  // Effect to set mounted state after initial render
  useEffect(() => {
    setIsMounted(true);
  }, []); // Fixed the syntax error in dependency array

  // Prevent hydration issues by not rendering until mounted
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingsModal />
    </>
  );
};
