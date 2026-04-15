import { useState, useEffect, useCallback } from "react";
import type { Show, ShowStatus } from "@/types/show";

const STORAGE_KEY = "tv-show-manager-shows";

function loadShows(): Show[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useShows() {
  const [shows, setShows] = useState<Show[]>(loadShows);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shows));
  }, [shows]);

  const addShow = useCallback((show: Omit<Show, "id" | "createdAt" | "favorite">) => {
    setShows((prev) => [...prev, { ...show, id: crypto.randomUUID(), createdAt: Date.now(), favorite: false }]);
  }, []);

  const updateShow = useCallback((id: string, updates: Partial<Show>) => {
    setShows((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const deleteShow = useCallback((id: string) => {
    setShows((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const moveShow = useCallback((id: string, status: ShowStatus) => {
    setShows((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setShows((prev) => prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s)));
  }, []);

  return { shows, addShow, updateShow, deleteShow, moveShow, toggleFavorite };
}
