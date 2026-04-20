import { useCallback, useEffect, useState } from "react";
import type { Show, ShowStatus } from "@/types/show";

const keyFor = (profileId: string) => `tv-tracker-shows:${profileId}`;

function load(profileId: string): Show[] {
  try {
    const raw = localStorage.getItem(keyFor(profileId));
    return raw ? (JSON.parse(raw) as Show[]) : [];
  } catch {
    return [];
  }
}

export function useShows(profileId: string | undefined) {
  const [shows, setShows] = useState<Show[]>(() => (profileId ? load(profileId) : []));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    setShows(load(profileId));
  }, [profileId]);

  useEffect(() => {
    if (!profileId) return;
    localStorage.setItem(keyFor(profileId), JSON.stringify(shows));
  }, [shows, profileId]);

  const addShow = useCallback(
    (data: Pick<Show, "title" | "description" | "genre" | "status" | "notes">) => {
      const now = new Date().toISOString();
      const show: Show = {
        id: crypto.randomUUID(),
        favorite: false,
        rating: null,
        createdAt: now,
        updatedAt: now,
        ...data,
      };
      setShows((prev) => [...prev, show]);
    },
    []
  );

  const updateShow = useCallback((id: string, updates: Partial<Show>) => {
    setShows((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s))
    );
  }, []);

  const deleteShow = useCallback((id: string) => {
    setShows((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const moveShow = useCallback((id: string, status: ShowStatus) => {
    setShows((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s))
    );
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setShows((prev) =>
      prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s))
    );
  }, []);

  return { shows, loading, addShow, updateShow, deleteShow, moveShow, toggleFavorite };
}
