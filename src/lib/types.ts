export type Category = {
  slug: string;
  title: string;
  caption: string;
  icon: string;
  order: number;
};

export type Price = "" | "$" | "$$" | "$$$";

export type PlaceLinks = {
  googleMapsUrl: string;
  appleMapsUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  phone?: string;
};

export type Place = {
  id: string;
  name: string;
  categories: string[];
  area: string;
  lat: number;
  lng: number;
  oneLiner: string;
  story: string;
  signatureMove: string;
  bestTime: string;
  vibes: string[];
  price?: Price;
  links: PlaceLinks;
  images?: string[];
  warnings?: string[] | string;
  accessibilityNotes?: string;
};
