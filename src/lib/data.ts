import categoriesData from "../../data/categories.json";
import placesData from "../../data/places.json";
import type { Category, Place } from "./types";

const categories = categoriesData as Category[];
const places = placesData as Place[];

export const getCategories = () =>
  categories.slice().sort((a, b) => a.order - b.order);

export const getCategoryBySlug = (slug: string) =>
  categories.find((category) => category.slug === slug);

export const getPlaces = () => places.slice();

export const getPlacesByCategory = (slug: string) =>
  places.filter((place) => place.categories.includes(slug));

export const getPlaceById = (id: string) =>
  places.find((place) => place.id === id);
