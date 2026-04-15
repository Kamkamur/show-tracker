import { Star, Pencil, Trash2, StickyNote, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Show, ShowStatus } from "@/types/show";
import { STATUS_LABELS } from "@/types/show";

interface ShowCardProps {
  show: Show;
  onEdit: (show: Show) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: ShowStatus) => void;
  onToggleFavorite: (id: string) => void;
  onOpenNotes: (show: Show) => void;
}

export function ShowCard({ show, onEdit, onDelete, onMove, onToggleFavorite, onOpenNotes }: ShowCardProps) {
  const otherStatuses = (Object.keys(STATUS_LABELS) as ShowStatus[]).filter((s) => s !== show.status);

  return (
    <Card className="group relative transition-all hover:shadow-md">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight flex-1">{show.title}</h3>
          <button onClick={() => onToggleFavorite(show.id)} className="shrink-0">
            <Star className={`h-4 w-4 transition-colors ${show.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400"}`} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">{show.genre}</Badge>
        </div>

        {show.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{show.description}</p>
        )}

        {show.notes && (
          <p className="text-xs text-muted-foreground italic line-clamp-1">📝 {show.notes}</p>
        )}

        <div className="flex items-center gap-1 pt-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                Move <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {otherStatuses.map((s) => (
                <DropdownMenuItem key={s} onClick={() => onMove(show.id, s)}>
                  {STATUS_LABELS[s]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onOpenNotes(show)}>
            <StickyNote className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(show)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(show.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
