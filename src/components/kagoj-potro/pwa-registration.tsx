"use client";

import { useEffect } from "react";

export function PwaRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator && typeof window !== "undefined") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("SW registered: ", registration);
          },
          (registrationError) => {
            console.log("SW registration failed: ", registrationError);
          }
        );
      });
    }
  }, []);

  return null;
}
