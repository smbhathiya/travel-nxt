"use client";

import { useState, useEffect } from "react";
import Loader from "./loader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      setIsAppLoaded(true);
    } else {
      const handleLoad = () => setIsAppLoaded(true);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (!isAppLoaded) {
    return <Loader />;
  }

  return (
    <>
      {children}
    </>
  );
}