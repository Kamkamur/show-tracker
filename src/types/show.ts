export type ShowStatus = "plan-to-watch" | "watching" | "completed" | "waiting";

export const STATUS_LABELS: Record<ShowStatus, string> = {
  "plan-to-watch": "Plan to Watch",
  watching: "Watching",
  completed: "Completed",
  waiting: "Waiting for New Season",
};

export const GENRES = [
  "Action", "Comedy", "Drama", "Fantasy", "Horror",
  "Mystery", "Romance", "Sci-Fi", "Thriller", "Documentary", "Animation", "Other",
] as const;

export type Genre = (typeof GENRES)[number];

export interface Show {
  id: string;
  title: string;
  description: string;
  genre: Genre;
  status: ShowStatus;
  notes: string;
  favorite: boolean;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}
