import categoriesData from "../../data/categories.json";
import type { Category } from "./types";

const categories = categoriesData as Category[];

export const getCategories = () =>
  categories.slice().sort((a, b) => a.order - b.order);

export const getCategoryBySlug = (slug: string) =>
  categories.find((category) => category.slug === slug);
