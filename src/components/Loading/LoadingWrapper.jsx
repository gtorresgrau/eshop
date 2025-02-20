"use client"; // En un nuevo archivo LoadingWrapper.jsx

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loading from "./Loading";

export default function LoadingWrapper({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading && <Loading />}
      {children}
    </>
  );
}
