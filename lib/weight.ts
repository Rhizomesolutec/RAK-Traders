export function formatWeight(grams: number): string {
  if (grams >= 1000 && grams % 1000 === 0) return `${grams / 1000} kg`;
  if (grams > 1000) return `${(grams / 1000).toFixed(grams % 100 === 0 ? 1 : 2).replace(/\.0$/, "")} kg`;
  return `${grams} g`;
}
