

## TV Show Manager — Implementation Plan

A clean, dashboard-style app to track TV shows across four status categories, with theming, search, and local storage persistence.

### Layout & Structure
- **Header**: App title, search bar, theme switcher dropdown, "Add Show" button
- **Dashboard**: Four columns/sections for "Plan to Watch", "Watching", "Completed", "Waiting for New Season"
- **Each show card**: Title, genre badge, description snippet, favorite star, action buttons (move, edit, delete, notes)

### Core Features
1. **Add/Edit/Delete Shows** — Modal/dialog form with title (required), description (optional), genre dropdown, status selector
2. **Status Management** — Each card has a dropdown or buttons to move between the 4 categories
3. **Notes** — Expandable notes section per show (season, episode, thoughts) editable inline or via dialog
4. **Favorites** — Star toggle on each card, visually highlighted
5. **Search** — Real-time filter across all categories by title/genre/notes

### Theme System
- CSS variables for all colors (background, cards, text, accent, borders)
- 3+ built-in themes: **Dark** (default), **Light**, **Custom Accent** (e.g. purple/teal tint)
- Theme switcher dropdown in header
- Custom color picker allowing user to adjust background, card, text, and accent colors
- All theme preferences saved to localStorage

### Data Persistence
- All show data and theme settings stored in localStorage
- Custom React hooks: `useShows()` and `useTheme()` to encapsulate logic

### Pages & Components
- `Index.tsx` — Main dashboard page
- `ShowCard.tsx` — Individual show card
- `AddEditShowDialog.tsx` — Form dialog for creating/editing
- `NotesDialog.tsx` — Notes editor dialog
- `ThemeSwitcher.tsx` — Theme dropdown + custom color pickers
- `SearchBar.tsx` — Search input component
- `StatusColumn.tsx` — Column wrapper per category

### Design
- Minimalistic, card-based layout using existing shadcn/ui components (Card, Dialog, Badge, Button, Select, Input)
- Dark mode as default theme
- Responsive: columns stack on mobile

