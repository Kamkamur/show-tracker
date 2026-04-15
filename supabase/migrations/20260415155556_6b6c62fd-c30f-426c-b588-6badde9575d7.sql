
-- Create shows table
CREATE TABLE public.shows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  genre TEXT NOT NULL DEFAULT 'Drama',
  status TEXT NOT NULL DEFAULT 'plan-to-watch',
  notes TEXT DEFAULT '',
  favorite BOOLEAN NOT NULL DEFAULT false,
  rating SMALLINT CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create show_tags table (future: custom labels)
CREATE TABLE public.show_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  show_id UUID NOT NULL REFERENCES public.shows(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(show_id, tag)
);

-- Create watch_history table (future: episode tracking)
CREATE TABLE public.watch_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  show_id UUID NOT NULL REFERENCES public.shows(id) ON DELETE CASCADE,
  season SMALLINT,
  episode SMALLINT,
  watched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  note TEXT DEFAULT ''
);

-- Create shared_lists table (future: sharing via link)
CREATE TABLE public.shared_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT 'My Shows',
  show_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.show_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_lists ENABLE ROW LEVEL SECURITY;

-- Open access policies (no auth for now)
CREATE POLICY "Allow all access to shows" ON public.shows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to show_tags" ON public.show_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to watch_history" ON public.watch_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to shared_lists" ON public.shared_lists FOR ALL USING (true) WITH CHECK (true);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_shows_updated_at
  BEFORE UPDATE ON public.shows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for common queries
CREATE INDEX idx_shows_status ON public.shows(status);
CREATE INDEX idx_shows_favorite ON public.shows(favorite);
CREATE INDEX idx_show_tags_show_id ON public.show_tags(show_id);
CREATE INDEX idx_watch_history_show_id ON public.watch_history(show_id);
CREATE INDEX idx_shared_lists_slug ON public.shared_lists(slug);
