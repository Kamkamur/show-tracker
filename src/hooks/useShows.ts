import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Show, ShowStatus } from "@/types/show";
import { rowToShow } from "@/types/show";
import { toast } from "sonner";

export function useShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all shows on mount
  useEffect(() => {
    const fetchShows = async () => {
      const { data, error } = await supabase
        .from("shows")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to fetch shows:", error);
        toast.error("Failed to load shows");
      } else {
        setShows((data ?? []).map(rowToShow));
      }
      setLoading(false);
    };

    fetchShows();

    // Real-time subscription
    const channel = supabase
      .channel("shows-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "shows" }, () => {
        // Re-fetch on any change for simplicity
        fetchShows();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addShow = useCallback(async (show: Pick<Show, "title" | "description" | "genre" | "status" | "notes">) => {
    const { data, error } = await supabase
      .from("shows")
      .insert({
        title: show.title,
        description: show.description,
        genre: show.genre,
        status: show.status,
        notes: show.notes,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add show:", error);
      toast.error("Failed to add show");
    } else if (data) {
      setShows((prev) => [...prev, rowToShow(data)]);
    }
  }, []);

  const updateShow = useCallback(async (id: string, updates: Partial<Show>) => {
    const dbUpdates: {
      title?: string;
      description?: string;
      genre?: string;
      status?: string;
      notes?: string;
      favorite?: boolean;
      rating?: number | null;
    } = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.genre !== undefined) dbUpdates.genre = updates.genre;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.favorite !== undefined) dbUpdates.favorite = updates.favorite;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;

    const { error } = await supabase.from("shows").update(dbUpdates).eq("id", id);

    if (error) {
      console.error("Failed to update show:", error);
      toast.error("Failed to update show");
    } else {
      setShows((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    }
  }, []);

  const deleteShow = useCallback(async (id: string) => {
    const { error } = await supabase.from("shows").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete show:", error);
      toast.error("Failed to delete show");
    } else {
      setShows((prev) => prev.filter((s) => s.id !== id));
    }
  }, []);

  const moveShow = useCallback(async (id: string, status: ShowStatus) => {
    const { error } = await supabase.from("shows").update({ status }).eq("id", id);

    if (error) {
      console.error("Failed to move show:", error);
      toast.error("Failed to move show");
    } else {
      setShows((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    }
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    const show = shows.find((s) => s.id === id);
    if (!show) return;

    const { error } = await supabase.from("shows").update({ favorite: !show.favorite }).eq("id", id);

    if (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorite");
    } else {
      setShows((prev) => prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s)));
    }
  }, [shows]);

  return { shows, loading, addShow, updateShow, deleteShow, moveShow, toggleFavorite };
}
