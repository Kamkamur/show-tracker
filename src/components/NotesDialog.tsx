import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Show } from "@/types/show";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  show: Show | null;
  onSave: (id: string, notes: string) => void;
}

export function NotesDialog({ open, onOpenChange, show, onSave }: Props) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (show) setNotes(show.notes);
  }, [show, open]);

  const handleSave = () => {
    if (show) onSave(show.id, notes.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notes — {show?.title}</DialogTitle>
        </DialogHeader>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Season, episode, thoughts..." rows={5} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Notes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
