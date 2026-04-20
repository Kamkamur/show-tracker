import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfiles } from "@/hooks/useProfiles";
import { CreateProfileDialog } from "@/components/CreateProfileDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ProfileSelect = () => {
  const navigate = useNavigate();
  const { profiles, addProfile, deleteProfile } = useProfiles();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = (name: string, emoji: string) => {
    const p = addProfile(name, emoji);
    navigate(`/profile/${p.id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex items-center gap-2 px-4 py-4">
          <Tv className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold">TV Tracker</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">Who's watching?</h2>
        <p className="text-muted-foreground text-center mb-10">Select a profile to continue</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl w-full">
          {profiles.map((p) => (
            <div key={p.id} className="group flex flex-col items-center gap-2">
              <button
                onClick={() => navigate(`/profile/${p.id}`)}
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-accent flex items-center justify-center text-5xl sm:text-6xl transition-all hover:scale-105 hover:ring-4 hover:ring-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
                aria-label={`Open ${p.name}'s profile`}
              >
                {p.emoji}
              </button>
              <span className="font-medium text-foreground text-center truncate max-w-[8rem]">{p.name}</span>
              <button
                onClick={() => setDeleteId(p.id)}
                className="text-xs text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                aria-label={`Delete ${p.name}`}
              >
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            </div>
          ))}

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setCreateOpen(true)}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-muted-foreground/40 flex items-center justify-center text-muted-foreground transition-all hover:border-primary hover:text-primary hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
              aria-label="Add profile"
            >
              <Plus className="h-10 w-10" />
            </button>
            <span className="font-medium text-muted-foreground">Add Profile</span>
          </div>
        </div>

        {profiles.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground">Create your first profile to get started</p>
        )}
      </main>

      <CreateProfileDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={handleCreate} />

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the profile and all its shows. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) deleteProfile(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileSelect;
