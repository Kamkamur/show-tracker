import { useEffect, useState } from "react";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROFILE_EMOJIS, randomEmoji } from "@/types/profile";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, emoji: string) => void;
}

export function CreateProfileDialog({ open, onOpenChange, onCreate }: Props) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(randomEmoji());
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setEmoji(randomEmoji());
      setPicking(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), emoji);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-5xl">
              {emoji}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEmoji(randomEmoji(emoji))}>
                <Shuffle className="h-4 w-4 mr-1" /> Random
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setPicking((p) => !p)}>
                {picking ? "Hide" : "Choose"}
              </Button>
            </div>
            {picking && (
              <div className="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto p-2 rounded-md border w-full">
                {PROFILE_EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`text-2xl p-1 rounded hover:bg-accent transition-colors ${
                      e === emoji ? "bg-primary/20 ring-2 ring-primary" : ""
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
              maxLength={30}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
