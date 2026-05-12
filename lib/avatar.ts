const GRADIENTS = [
  "from-indigo-500 to-violet-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-blue-500",
  "from-rose-500 to-pink-500",
  "from-violet-500 to-fuchsia-500",
  "from-cyan-500 to-sky-500",
  "from-lime-500 to-emerald-500",
] as const;

const SOFT_GRADIENTS = [
  "from-indigo-100 to-violet-100",
  "from-emerald-100 to-teal-100",
  "from-amber-100 to-orange-100",
  "from-sky-100 to-blue-100",
  "from-rose-100 to-pink-100",
  "from-violet-100 to-fuchsia-100",
  "from-cyan-100 to-sky-100",
  "from-lime-100 to-emerald-100",
] as const;

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function avatarGradient(seed: string | null | undefined): string {
  const key = (seed ?? "").trim().toLowerCase() || "anon";
  return GRADIENTS[hash(key) % GRADIENTS.length];
}

export function avatarGradientSoft(seed: string | null | undefined): string {
  const key = (seed ?? "").trim().toLowerCase() || "anon";
  return SOFT_GRADIENTS[hash(key) % SOFT_GRADIENTS.length];
}

export function avatarInitial(seed: string | null | undefined): string {
  const trimmed = (seed ?? "").trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}
