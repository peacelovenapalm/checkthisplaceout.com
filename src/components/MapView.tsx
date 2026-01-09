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
  const baseIcon = useMemo(
    () =>
      L.divIcon({
        className: "ctpo-marker",
        html:
          "<div class='ctpo-marker__icon'></div><div class='ctpo-marker__pulse'></div>",
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      }),
    []
  );
  const activeIcon = useMemo(
    () =>
      L.divIcon({
        className: "ctpo-marker is-active",
        html:
          "<div class='ctpo-marker__icon'></div><div class='ctpo-marker__pulse'></div>",
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      }),
    []
  );

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
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds places={places} />
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={place.id === selectedId ? activeIcon : baseIcon}
            eventHandlers={{
              click: () => onSelect(place.id)
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
