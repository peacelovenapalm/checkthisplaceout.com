"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PACK_PARAM = "pack";
const MAX_PACK = 4;
const MIN_PACK = 2;

const parsePackParam = (value: string | null) => {
  if (!value) return [];
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const unique = (ids: string[]) => {
  const seen = new Set<string>();
  const output: string[] = [];
  ids.forEach((id) => {
    if (seen.has(id)) return;
    seen.add(id);
    output.push(id);
  });
  return output;
};

export const useOpsPack = (availableIds: string[]) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const availableSet = useMemo(() => new Set(availableIds), [availableIds]);
  const packFromUrl = useMemo(() => {
    const ids = parsePackParam(searchParams.get(PACK_PARAM));
    return unique(ids.filter((id) => availableSet.has(id)));
  }, [searchParams, availableSet]);

  const [packIds, setPackIds] = useState<string[]>(packFromUrl);

  useEffect(() => {
    setPackIds(packFromUrl);
  }, [packFromUrl]);

  const syncUrl = useCallback(
    (nextIds: string[]) => {
      const nextParam = nextIds.join(",");
      const currentParam = searchParams.get(PACK_PARAM) ?? "";
      if (nextParam === currentParam) return;

      const nextSearch = new URLSearchParams(searchParams.toString());
      if (nextParam) {
        nextSearch.set(PACK_PARAM, nextParam);
      } else {
        nextSearch.delete(PACK_PARAM);
      }

      const query = nextSearch.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    syncUrl(packIds);
  }, [packIds, syncUrl]);

  const toggle = useCallback((id: string) => {
    setPackIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((entry) => entry !== id);
      }
      if (prev.length >= MAX_PACK) {
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setPackIds((prev) => prev.filter((entry) => entry !== id));
  }, []);

  const clear = useCallback(() => {
    setPackIds([]);
  }, []);

  const sharePath = useMemo(() => {
    const nextSearch = new URLSearchParams(searchParams.toString());
    const nextParam = packIds.join(",");
    if (nextParam) {
      nextSearch.set(PACK_PARAM, nextParam);
    } else {
      nextSearch.delete(PACK_PARAM);
    }
    const query = nextSearch.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [packIds, pathname, searchParams]);

  const [shareUrl, setShareUrl] = useState(sharePath);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShareUrl(`${window.location.origin}${sharePath}`);
  }, [sharePath]);

  return {
    packIds,
    toggle,
    remove,
    clear,
    shareUrl,
    canShare: packIds.length >= MIN_PACK,
    isFull: packIds.length >= MAX_PACK,
    min: MIN_PACK,
    max: MAX_PACK
  };
};
