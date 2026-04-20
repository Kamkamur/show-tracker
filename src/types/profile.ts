export interface Profile {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
}

export const PROFILE_EMOJIS = [
  "😀", "😎", "🤩", "🥳", "🦄", "🐱", "🐶", "🦊", "🐼", "🐸",
  "🐯", "🦁", "🐨", "🐵", "🦖", "🐙", "🦋", "🌸", "🌟", "🔥",
  "⚡", "🍕", "🍔", "🍩", "🍿", "🎬", "🎮", "🎧", "🎸", "🚀",
  "👾", "👻", "🤖", "👑", "🌈", "⭐", "🎯", "🏆", "💎", "🎨",
];

export function randomEmoji(exclude?: string): string {
  const pool = exclude ? PROFILE_EMOJIS.filter((e) => e !== exclude) : PROFILE_EMOJIS;
  return pool[Math.floor(Math.random() * pool.length)];
}
