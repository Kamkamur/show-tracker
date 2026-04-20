import { useCallback, useEffect, useState } from "react";
import type { Profile } from "@/types/profile";

const STORAGE_KEY = "tv-tracker-profiles";

function load(): Profile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Profile[]) : [];
  } catch {
    return [];
  }
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  const addProfile = useCallback((name: string, emoji: string) => {
    const profile: Profile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      emoji,
      createdAt: new Date().toISOString(),
    };
    setProfiles((prev) => [...prev, profile]);
    return profile;
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    // Also clean up that profile's shows
    localStorage.removeItem(`tv-tracker-shows:${id}`);
  }, []);

  const getProfile = useCallback((id: string) => profiles.find((p) => p.id === id), [profiles]);

  return { profiles, addProfile, deleteProfile, getProfile };
}
