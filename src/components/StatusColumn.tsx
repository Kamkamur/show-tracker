import type { Show, ShowStatus } from "@/types/show";
import { STATUS_LABELS } from "@/types/show";
import { ShowCard } from "./ShowCard";

interface StatusColumnProps {
  status: ShowStatus;
  shows: Show[];
  onEdit: (show: Show) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: ShowStatus) => void;
  onToggleFavorite: (id: string) => void;
  onOpenNotes: (show: Show) => void;
}

export function StatusColumn({ status, shows, onEdit, onDelete, onMove, onToggleFavorite, onOpenNotes }: StatusColumnProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{STATUS_LABELS[status]}</h2>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{shows.length}</span>
      </div>
      <div className="space-y-3 min-h-[100px]">
        {shows.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">No shows here yet</p>
        ) : (
          shows.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              onToggleFavorite={onToggleFavorite}
              onOpenNotes={onOpenNotes}
            />
          ))
        )}
      </div>
    </div>
  );
}
