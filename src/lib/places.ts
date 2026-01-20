import placesData from "../../data/places.json";
import type { Place } from "@/lib/types";

const places = placesData as Place[];
const sortedPlaces = places
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name));

export const getApprovedPlaces = async () => {
  return sortedPlaces;
};

export const getApprovedPlacesByCategory = async (slug: string) => {
  return sortedPlaces.filter((place) => place.categories.includes(slug));
};

export const getApprovedPlaceById = async (id: string) => {
  return sortedPlaces.find((place) => place.id === id) ?? null;
};
