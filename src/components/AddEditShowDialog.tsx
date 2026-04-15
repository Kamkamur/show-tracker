import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Show, ShowStatus, Genre } from "@/types/show";
import { GENRES, STATUS_LABELS } from "@/types/show";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  show?: Show | null;
  onSave: (data: { title: string; description: string; genre: Genre; status: ShowStatus; notes: string }) => void;
}

export function AddEditShowDialog({ open, onOpenChange, show, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState<Genre>("Drama");
  const [status, setStatus] = useState<ShowStatus>("plan-to-watch");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (show) {
      setTitle(show.title);
      setDescription(show.description);
      setGenre(show.genre);
      setStatus(show.status);
      setNotes(show.notes);
    } else {
      setTitle("");
      setDescription("");
      setGenre("Drama");
      setStatus("plan-to-watch");
      setNotes("");
    }
  }, [show, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), genre, status, notes: notes.trim() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{show ? "Edit Show" : "Add Show"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Show title" required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Genre</Label>
              <Select value={genre} onValueChange={(v) => setGenre(v as Genre)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GENRES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ShowStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(STATUS_LABELS) as [ShowStatus, string][]).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{show ? "Save" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
