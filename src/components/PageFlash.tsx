"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

export default function PageFlash() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const raf = window.requestAnimationFrame(() => setActive(true));
    const timeout = window.setTimeout(() => setActive(false), 50);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [pathname, reduceMotion]);

  return (
    <div
      aria-hidden="true"
      className={`page-flash${active ? " is-active" : ""}`}
    />
  );
}
