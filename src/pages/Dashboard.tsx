import { useMemo, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { Tv, Plus, Eye, CheckCircle2, Clock, PauseCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useShows } from "@/hooks/useShows";
import { useTheme } from "@/hooks/useTheme";
import { useProfiles } from "@/hooks/useProfiles";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { AddEditShowDialog } from "@/components/AddEditShowDialog";
import type { Show, ShowStatus } from "@/types/show";
import { STATUS_LABELS } from "@/types/show";

const STATUS_ICONS: Record<ShowStatus, React.ReactNode> = {
  "plan-to-watch": <Clock className="h-6 w-6" />,
  watching: <Eye className="h-6 w-6" />,
  completed: <CheckCircle2 className="h-6 w-6" />,
  waiting: <PauseCircle className="h-6 w-6" />,
};

const STATUSES = Object.keys(STATUS_LABELS) as ShowStatus[];

const Dashboard = () => {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId: string }>();
  const { getProfile } = useProfiles();
  const profile = profileId ? getProfile(profileId) : undefined;
  const { shows, addShow } = useShows(profileId);
  const { themeName, currentColors, setTheme, setCustomColor } = useTheme();
  const [addOpen, setAddOpen] = useState(false);

  const counts = useMemo(() => {
    const map: Record<ShowStatus, number> = { "plan-to-watch": 0, watching: 0, completed: 0, waiting: 0 };
    shows.forEach((s) => map[s.status]++);
    return map;
  }, [shows]);

  if (!profile) return <Navigate to="/" replace />;

  const handleSave = (data: Pick<Show, "title" | "description" | "genre" | "status" | "notes">) => {
    addShow(data);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/")} aria-label="Switch profile">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Tv className="h-5 w-5 text-primary shrink-0" />
          <h1 className="text-lg font-bold text-foreground">TV Tracker</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-accent transition-colors"
              aria-label="Switch profile"
            >
              <span className="text-xl">{profile.emoji}</span>
              <span className="text-sm font-medium hidden sm:inline">{profile.name}</span>
            </button>
            <ThemeSwitcher
              themeName={themeName}
              currentColors={currentColors}
              onSetTheme={setTheme}
              onSetCustomColor={setCustomColor}
            />
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          {STATUSES.map((status) => (
            <Card
              key={status}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => navigate(`/profile/${profileId}/category/${status}`)}
            >
              <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
                <div className="text-primary">{STATUS_ICONS[status]}</div>
                <h2 className="font-semibold text-foreground">{STATUS_LABELS[status]}</h2>
                <span className="text-2xl font-bold text-primary">{counts[status]}</span>
                <span className="text-xs text-muted-foreground">
                  {counts[status] === 1 ? "show" : "shows"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <AddEditShowDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        show={null}
        onSave={handleSave}
      />
    </div>
  );
};

export default Dashboard;
