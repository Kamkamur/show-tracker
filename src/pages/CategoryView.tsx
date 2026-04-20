import { useState, useMemo } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShows } from "@/hooks/useShows";
import { useTheme } from "@/hooks/useTheme";
import { useProfiles } from "@/hooks/useProfiles";
import { ShowCard } from "@/components/ShowCard";
import { AddEditShowDialog } from "@/components/AddEditShowDialog";
import { NotesDialog } from "@/components/NotesDialog";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { SearchBar } from "@/components/SearchBar";
import type { Show, ShowStatus } from "@/types/show";
import { STATUS_LABELS } from "@/types/show";

const STATUSES = Object.keys(STATUS_LABELS) as ShowStatus[];

const CategoryView = () => {
  const { status, profileId } = useParams<{ status: string; profileId: string }>();
  const navigate = useNavigate();
  const { getProfile } = useProfiles();
  const profile = profileId ? getProfile(profileId) : undefined;
  const { shows, addShow, updateShow, deleteShow, moveShow, toggleFavorite } = useShows(profileId);
  const { themeName, currentColors, setTheme, setCustomColor } = useTheme();

  const [search, setSearch] = useState("");
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesShow, setNotesShow] = useState<Show | null>(null);

  const currentStatus = (STATUSES.includes(status as ShowStatus) ? status : "plan-to-watch") as ShowStatus;

  const filtered = useMemo(() => {
    let list = shows.filter((s) => s.status === currentStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) => s.title.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q) || s.notes.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
  }, [shows, currentStatus, search]);

  if (!profile) return <Navigate to="/" replace />;

  const handleEdit = (show: Show) => {
    setEditingShow(show);
    setAddEditOpen(true);
  };

  const handleSave = (data: Pick<Show, "title" | "description" | "genre" | "status" | "notes">) => {
    if (editingShow) {
      updateShow(editingShow.id, data);
    } else {
      addShow({ ...data, status: currentStatus });
    }
    setEditingShow(null);
  };

  const handleOpenNotes = (show: Show) => {
    setNotesShow(show);
    setNotesOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex flex-wrap items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 sm:gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/profile/${profileId}`)} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-base sm:text-lg font-bold text-foreground">{STATUS_LABELS[currentStatus]}</h1>
          <span className="text-sm text-muted-foreground">({filtered.length})</span>
          <div className="order-last w-full sm:order-none sm:w-auto sm:flex-1 sm:max-w-xs">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2 sm:ml-0">
            <span className="text-xl" title={profile.name}>{profile.emoji}</span>
            <ThemeSwitcher
              themeName={themeName}
              currentColors={currentColors}
              onSetTheme={setTheme}
              onSetCustomColor={setCustomColor}
            />
            <Button size="sm" onClick={() => { setEditingShow(null); setAddEditOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No shows in this category yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {filtered.map((show) => (
              <ShowCard
                key={show.id}
                show={show}
                onEdit={handleEdit}
                onDelete={deleteShow}
                onMove={moveShow}
                onToggleFavorite={toggleFavorite}
                onOpenNotes={handleOpenNotes}
              />
            ))}
          </div>
        )}
      </main>

      <AddEditShowDialog
        open={addEditOpen}
        onOpenChange={(open) => { setAddEditOpen(open); if (!open) setEditingShow(null); }}
        show={editingShow}
        onSave={handleSave}
      />
      <NotesDialog
        open={notesOpen}
        onOpenChange={setNotesOpen}
        show={notesShow}
        onSave={(id, notes) => updateShow(id, { notes })}
      />
    </div>
  );
};

export default CategoryView;
