"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
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
  "late-night-bites": "#FF5F00",
  "classic-vegas": "#BC13FE",
  cocktails: "#FF003C",
  views: "#00F0FF",
  "arts-district": "#BC13FE",
  "low-key": "#00F0FF",
  dessert: "#FF5F00",
  breakfast: "#E0FF00",
  music: "#00F0FF"
};
const DEFAULT_MARKER_COLOR = "#00F0FF";
const MARKER_SIZE = 18;

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
  const markerIconCache = useMemo(() => new Map<string, L.DivIcon>(), []);

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
      <MapContainer
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
      </MapContainer>
    </div>
  );
}
