export function pluralize(word: string, value: number): string {
  const plural = value && (value > 0 || value === 0) ? "s" : "";
  return `${word}${plural}`;
}
