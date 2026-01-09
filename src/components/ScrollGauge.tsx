"use client";

import { useEffect, useState } from "react";

export default function ScrollGauge() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.min(Math.max(value, 0), 1));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div aria-hidden="true" className="scroll-gauge">
      <div className="scroll-gauge__track" />
      <div
        className="scroll-gauge__fill"
        style={{ transform: `scaleY(${progress})` }}
      />
    </div>
  );
}
