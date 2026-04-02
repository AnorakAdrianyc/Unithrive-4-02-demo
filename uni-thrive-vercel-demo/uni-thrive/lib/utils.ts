import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function getRiskColor(level: string): string {
  return ({
    low:      'var(--color-success)',
    moderate: 'var(--color-warning)',
    high:     'var(--color-error)',
    crisis:   'var(--color-notification)',
  } as Record<string, string>)[level] ?? 'var(--color-text-muted)'
}

export function getRiskBg(level: string): string {
  return ({
    low:      'var(--color-success-highlight)',
    moderate: 'var(--color-warning-highlight)',
    high:     'var(--color-error-highlight)',
    crisis:   'var(--color-notification-highlight)',
  } as Record<string, string>)[level] ?? 'var(--color-surface-offset)'
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-HK', {
    weekday: 'short', month: 'short', day: 'numeric'
  })
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 65) return 'Good'
  if (score >= 50) return 'Fair'
  if (score >= 35) return 'Needs Attention'
  return 'Critical'
}
