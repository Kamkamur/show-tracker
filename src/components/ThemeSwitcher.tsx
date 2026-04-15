import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ThemeName } from "@/hooks/useTheme";

const THEME_OPTIONS: { name: ThemeName; label: string }[] = [
  { name: "dark", label: "🌙 Dark" },
  { name: "light", label: "☀️ Light" },
  { name: "accent", label: "💜 Purple Accent" },
];

function hslToHex(hsl: string): string {
  const parts = hsl.split(/\s+/).map(parseFloat);
  if (parts.length < 3) return "#000000";
  const [h, s, l] = [parts[0], parts[1] / 100, parts[2] / 100];
  const a2 = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a2 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return `0 0% ${Math.round(l * 100)}%`;
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

interface Props {
  themeName: ThemeName;
  currentColors: Record<string, string>;
  onSetTheme: (name: ThemeName) => void;
  onSetCustomColor: (key: string, value: string) => void;
}

const CUSTOM_FIELDS = [
  { key: "background", label: "Background" },
  { key: "card", label: "Cards" },
  { key: "foreground", label: "Text" },
  { key: "primary", label: "Accent" },
];

export function ThemeSwitcher({ themeName, currentColors, onSetTheme, onSetCustomColor }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        {THEME_OPTIONS.map((t) => (
          <DropdownMenuItem key={t.name} onClick={() => onSetTheme(t.name)} className={themeName === t.name ? "bg-accent" : ""}>
            {t.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Custom Colors</DropdownMenuLabel>
        <div className="px-2 pb-2 space-y-2">
          {CUSTOM_FIELDS.map((f) => (
            <div key={f.key} className="flex items-center justify-between gap-2">
              <Label className="text-xs">{f.label}</Label>
              <Input
                type="color"
                className="h-7 w-10 p-0.5 cursor-pointer"
                value={hslToHex(currentColors[f.key] ?? "0 0% 0%")}
                onChange={(e) => onSetCustomColor(f.key, hexToHsl(e.target.value))}
              />
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
