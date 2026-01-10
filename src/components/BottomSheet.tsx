"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

type BottomSheetProps = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function BottomSheet({
  isOpen,
  title,
  onClose,
  children
}: BottomSheetProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="false"
        aria-label={title || "Map details"}
        className="panel relative mx-4 mb-4 w-full max-w-md overflow-auto border border-[color:var(--border-color)] sm:mb-0 sm:max-h-[70vh]"
      >
        <div className="window-bar">
          <span className="window-title">Selected</span>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost px-2 py-1 text-[10px]"
          >
            Close
          </button>
        </div>
        <div className="p-4">
          {title && <h3 className="display-title text-lg">{title}</h3>}
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
