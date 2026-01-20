export type Category = {
  slug: string;
  title: string;
  caption: string;
  icon: string;
  order: number;
};

export type Price = "" | "$" | "$$" | "$$$";

export type ProfileRole = "admin" | "bartender";

export type PlaceStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "archived";

export type PlaceLinks = {
  googleMapsUrl: string;
  appleMapsUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  phone?: string;
};

export type Profile = {
  id: string;
  display_name: string | null;
  handle: string | null;
  role: ProfileRole;
  is_active: boolean;
  created_at: string;
};

export type PlaceRecord = {
  id: string;
  created_by: string;
  title: string;
  slug: string;
  description_short: string | null;
  story: string | null;
  signature_move: string | null;
  best_time: string | null;
  warnings: string[] | null;
  area: string | null;
  categories: string[] | null;
  vibes: string[] | null;
  price: Price | null;
  lat: number | string | null;
  lng: number | string | null;
  links: PlaceLinks | null;
  images: string[] | null;
  status: PlaceStatus;
  submitted_at: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type VoteRecord = {
  id: string;
  place_id: string;
  voter_id: string;
  vote: "yes" | "no";
  created_at: string;
};

export type Place = {
  id: string;
  title: string;
  categories: string[];
  area: string;
  lat: number;
  lng: number;
  description_short: string;
  story: string;
  signature_move: string;
  best_time: string;
  vibes: string[];
  price?: Price;
  links: PlaceLinks;
  images?: string[];
  warnings?: string[];
};
