export function sanitizeText(input: string, maxLength = 500): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>&"'`]/g, (c) =>
      ({ '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#x27;','`':'&#x60;' }[c] ?? c))
    .slice(0, maxLength)
    .trim()
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function clampScore(val: number, min = 1, max = 10): number {
  return Math.max(min, Math.min(max, Math.round(val)))
}
