"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { LeafletProvider, createLeafletContext } from "@react-leaflet/core";
import { Marker, TileLayer, useMap, type MapContainerProps } from "react-leaflet";
import L from "leaflet";
import type { Place } from "@/lib/types";

type MapViewProps = {
  places: Place[];
  selectedId?: string | null;
  onSelect: (placeId: string) => void;
};

type MarkerPalette = {
  stroke: string;
  fill: string;
  core: string;
  pulse: string;
};

const CATEGORY_COLOR_MAP: Record<string, string> = {
  "late-night-bites": "#00ff41",
  "classic-vegas": "#ff00ff",
  cocktails: "#ff00ff",
  views: "#00f0ff",
  "arts-district": "#fcee0a",
  "low-key": "#00f0ff",
  dessert: "#fcee0a",
  breakfast: "#fcee0a",
  music: "#00ff41"
};
const DEFAULT_MARKER_COLOR = "#00f0ff";
const MARKER_SIZE = 18;
const markerIconCache = new Map<string, L.DivIcon>();

const StableMapContainer = forwardRef<L.Map, MapContainerProps>(
  (
    {
      bounds,
      boundsOptions,
      center,
      children,
      className,
      id,
      placeholder,
      style,
      whenReady,
      zoom,
      ...options
    },
    forwardedRef
  ) => {
    const [containerProps] = useState(() => ({ className, id, style }));
    const [initial] = useState(() => ({
      bounds,
      boundsOptions,
      center,
      zoom,
      whenReady,
      options
    }));
    const [context, setContext] = useState<
      ReturnType<typeof createLeafletContext> | null
    >(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);

    useImperativeHandle(forwardedRef, () => mapRef.current as L.Map);

    useEffect(() => {
      const container = containerRef.current;
      if (!container || mapRef.current) return;

      // Guard against StrictMode / Fast Refresh re-init on the same DOM node.
      if ("_leaflet_id" in container) {
        delete (container as { _leaflet_id?: number })._leaflet_id;
      }

      const map = L.map(container, initial.options);
      mapRef.current = map;

      if (initial.center != null && initial.zoom != null) {
        map.setView(initial.center, initial.zoom);
      } else if (initial.bounds != null) {
        map.fitBounds(initial.bounds, initial.boundsOptions);
      }

      if (initial.whenReady != null) {
        map.whenReady(initial.whenReady);
      }

      setContext(createLeafletContext(map));

      return () => {
        map.remove();
        mapRef.current = null;
      };
    }, [initial]);

    const contents = context ? (
      <LeafletProvider value={context}>{children}</LeafletProvider>
    ) : (
      placeholder ?? null
    );

    return (
      <div {...containerProps} ref={containerRef}>
        {contents}
      </div>
    );
  }
);

StableMapContainer.displayName = "StableMapContainer";

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => char + char)
        .join("")
    : normalized;
  const intValue = Number.parseInt(value, 16);
  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255
  };
};

const buildMarkerPalette = (hex: string): MarkerPalette => {
  const { r, g, b } = hexToRgb(hex);
  return {
    stroke: hex,
    fill: `rgba(${r}, ${g}, ${b}, 0.2)`,
    core: `rgba(${r}, ${g}, ${b}, 0.7)`,
    pulse: `rgba(${r}, ${g}, ${b}, 0.6)`
  };
};

const buildMarkerHtml = (palette: MarkerPalette, isActive: boolean) => {
  const activeClass = isActive ? " is-active" : "";
  return `<div class="ctpo-marker__shell${activeClass}" style="--marker-stroke:${palette.stroke};--marker-fill:${palette.fill};--marker-core:${palette.core};--marker-pulse:${palette.pulse};"><div class="ctpo-marker__icon"></div><div class="ctpo-marker__pulse"></div></div>`;
};

function FitBounds({ places }: { places: Place[] }) {
  const map = useMap();

  useEffect(() => {
    if (!places.length) return;
    const bounds = L.latLngBounds(
      places.map((place) => [place.lat, place.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, places]);

  return null;
}

export default function MapView({ places, selectedId, onSelect }: MapViewProps) {
  const selected = places.find((place) => place.id === selectedId);

  const getMarkerIcon = (place: Place, isActive: boolean) => {
    const category = place.categories[0];
    const color = category
      ? CATEGORY_COLOR_MAP[category] ?? DEFAULT_MARKER_COLOR
      : DEFAULT_MARKER_COLOR;
    const cacheKey = `${color}-${isActive ? "active" : "base"}`;
    const cached = markerIconCache.get(cacheKey);
    if (cached) return cached;

    const palette = buildMarkerPalette(color);
    const icon = L.divIcon({
      className: "ctpo-marker",
      html: buildMarkerHtml(palette, isActive),
      iconSize: [MARKER_SIZE, MARKER_SIZE],
      iconAnchor: [MARKER_SIZE / 2, MARKER_SIZE / 2]
    });
    markerIconCache.set(cacheKey, icon);
    return icon;
  };

  return (
    <div className="map-shell">
      <StableMapContainer
        className="map-canvas h-[65vh] w-full"
        center={selected ? [selected.lat, selected.lng] : [36.1699, -115.1398]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_matter/{z}/{x}/{y}{r}.png"
        />
        <FitBounds places={places} />
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={getMarkerIcon(place, place.id === selectedId)}
            eventHandlers={{
              click: () => onSelect(place.id)
            }}
          />
        ))}
      </StableMapContainer>
    </div>
  );
}
