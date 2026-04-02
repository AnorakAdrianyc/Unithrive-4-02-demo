/**
 * AI/ML Service Stubs
 * Future: replace with HTTP calls to Python FastAPI microservices.
 * Interface is stable — no UI changes needed when swapping.
 */

export interface SentimentResult { score: number; label: 'positive' | 'neutral' | 'negative'; confidence: number }
export interface AlarmResult     { triggered: boolean; riskLevel: 'low' | 'moderate' | 'high' | 'crisis'; reason?: string }
export interface InsightResult   { summary: string; recommendations: string[] }

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  await new Promise(r => setTimeout(r, 300))
  const lower = text.toLowerCase()
  if (/great|happy|excited|good|awesome/.test(lower)) return { score: 0.82, label: 'positive',  confidence: 0.91 }
  if (/sad|tired|stressed|anxious|bad|awful/.test(lower)) return { score: 0.21, label: 'negative', confidence: 0.87 }
  return { score: 0.51, label: 'neutral', confidence: 0.74 }
}

export async function checkAlarm(scores: { mental: number; psych: number; physical: number }): Promise<AlarmResult> {
  await new Promise(r => setTimeout(r, 200))
  const avg = (scores.mental + scores.psych + scores.physical) / 3
  if (avg < 25) return { triggered: true,  riskLevel: 'crisis',   reason: 'All wellness indicators critically low' }
  if (avg < 40) return { triggered: true,  riskLevel: 'high',     reason: 'Multiple indicators below threshold' }
  if (avg < 55) return { triggered: false, riskLevel: 'moderate', reason: 'Some indicators need attention' }
  return { triggered: false, riskLevel: 'low' }
}

export async function generateInsights(_weekData: Record<string, number>[]): Promise<InsightResult> {
  await new Promise(r => setTimeout(r, 500))
  return {
    summary: 'Your wellness trend is stable with room to improve psychological resilience.',
    recommendations: [
      'Consider a 10-minute mindfulness break on high-stress days.',
      'Your physical scores are strong — maintain your current sleep schedule.',
      'Peer support activities correlate positively with your psych score.',
    ],
  }
}
