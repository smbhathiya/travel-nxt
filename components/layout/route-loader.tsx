"use client";

import { useEffect, useState } from "react";
import Loader from "./loader";

export default function RouteLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <Loader />;
  }

  return <>{children}</>;
}