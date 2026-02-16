"use client";

import { useCallback, useMemo, useState } from "react";
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

  const [packIds, setPackIds] = useState<string[]>(() => packFromUrl);

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

  const updatePack = useCallback(
    (nextIds: string[]) => {
      setPackIds(nextIds);
      syncUrl(nextIds);
    },
    [syncUrl]
  );

  const toggle = useCallback(
    (id: string) => {
      if (packIds.includes(id)) {
        updatePack(packIds.filter((entry) => entry !== id));
        return;
      }
      if (packIds.length >= MAX_PACK) {
        return;
      }
      updatePack([...packIds, id]);
    },
    [packIds, updatePack]
  );

  const remove = useCallback(
    (id: string) => {
      if (!packIds.includes(id)) return;
      updatePack(packIds.filter((entry) => entry !== id));
    },
    [packIds, updatePack]
  );

  const clear = useCallback(() => {
    if (!packIds.length) return;
    updatePack([]);
  }, [packIds, updatePack]);

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

  const shareUrl =
    typeof window === "undefined"
      ? sharePath
      : `${window.location.origin}${sharePath}`;

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
