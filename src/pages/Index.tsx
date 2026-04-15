import { useState, useMemo } from "react";
import { Plus, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShows } from "@/hooks/useShows";
import { useTheme } from "@/hooks/useTheme";
import { StatusColumn } from "@/components/StatusColumn";
import { AddEditShowDialog } from "@/components/AddEditShowDialog";
import { NotesDialog } from "@/components/NotesDialog";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { SearchBar } from "@/components/SearchBar";
import type { Show, ShowStatus } from "@/types/show";
import { STATUS_LABELS } from "@/types/show";

const STATUSES = Object.keys(STATUS_LABELS) as ShowStatus[];

const Index = () => {
  const { shows, addShow, updateShow, deleteShow, moveShow, toggleFavorite } = useShows();
  const { themeName, currentColors, setTheme, setCustomColor } = useTheme();

  const [search, setSearch] = useState("");
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesShow, setNotesShow] = useState<Show | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return shows;
    const q = search.toLowerCase();
    return shows.filter(
      (s) => s.title.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q) || s.notes.toLowerCase().includes(q)
    );
  }, [shows, search]);

  const grouped = useMemo(() => {
    const map: Record<ShowStatus, Show[]> = { "plan-to-watch": [], watching: [], completed: [], waiting: [] };
    // Sort favorites first
    const sorted = [...filtered].sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
    sorted.forEach((s) => map[s.status].push(s));
    return map;
  }, [filtered]);

  const handleEdit = (show: Show) => {
    setEditingShow(show);
    setAddEditOpen(true);
  };

  const handleSave = (data: Pick<Show, "title" | "description" | "genre" | "status" | "notes">) => {
    if (editingShow) {
      updateShow(editingShow.id, data);
    } else {
      addShow(data);
    }
    setEditingShow(null);
  };

  const handleOpenNotes = (show: Show) => {
    setNotesShow(show);
    setNotesOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center gap-3 px-4 py-3">
          <Tv className="h-5 w-5 text-primary shrink-0" />
          <h1 className="text-lg font-bold text-foreground whitespace-nowrap">TV Tracker</h1>
          <div className="flex-1 max-w-xs ml-auto sm:ml-4">
            <SearchBar value={search} onChange={setSearch} />
          </div>
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
      </header>

      {/* Dashboard */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATUSES.map((status) => (
            <StatusColumn
              key={status}
              status={status}
              shows={grouped[status]}
              onEdit={handleEdit}
              onDelete={deleteShow}
              onMove={moveShow}
              onToggleFavorite={toggleFavorite}
              onOpenNotes={handleOpenNotes}
            />
          ))}
        </div>
      </main>

      {/* Dialogs */}
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

export default Index;
