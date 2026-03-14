const API_URL = `${process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:8000"}/api/journal`

export interface EmotionResult {
  emotion: "Calm" | "Happy" | "Sad" | "Stressed"
  keywords: string[]
  summary: string
}

export interface JournalEntryPayload {
  userId: string
  ambience: string
  text: string
  emotion: string
}

export interface JournalEntryResponse {
  id: string
  date: string
  preview: string
  emotion: "Calm" | "Happy" | "Sad" | "Stressed"
}

export interface InsightsResponse {
  totalEntries: number
  topEmotion: string
  mostUsedAmbience: string
  recentKeywords: string[]
  moodData: { day: string; mood: number }[]
  emotionDistribution: { name: string; value: number; fill: string }[]
  topAmbiences: { name: string; count: number; icon?: any }[]
}

export const analyzeEmotionAPI = async (text: string): Promise<EmotionResult> => {
  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })
  if (!response.ok) throw new Error("Failed to analyze emotion")
  return response.json()
}

export const saveJournalEntryAPI = async (entry: JournalEntryPayload): Promise<void> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  })
  if (!response.ok) throw new Error("Failed to save journal entry")
}

export const getJournalEntriesAPI = async (userId: string): Promise<JournalEntryResponse[]> => {
  const response = await fetch(`${API_URL}/${userId}`)
  if (!response.ok) throw new Error("Failed to fetch journal entries")
  return response.json()
}

export const getJournalInsightsAPI = async (userId: string): Promise<InsightsResponse> => {
  const response = await fetch(`${API_URL}/insights/${userId}`)
  if (!response.ok) throw new Error("Failed to fetch insights")
  return response.json()
}
