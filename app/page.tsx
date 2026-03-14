"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { JournalEntry } from "@/components/journal-entry"
import { EmotionAnalysis, EmotionResult } from "@/components/emotion-analysis"
import { InsightsDashboard } from "@/components/insights-dashboard"
import { RecentEntries } from "@/components/recent-entries"
import { analyzeEmotionAPI, saveJournalEntryAPI } from "@/services/api"

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<EmotionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAnalyze = async (text: string, ambience: string) => {
    setIsAnalyzing(true)

    try {
      // Call backend API for analysis
      const result = await analyzeEmotionAPI(text)
      setAnalysisResult(result)

      // Call backend API to save the entry
      await saveJournalEntryAPI({
        userId: "demo-user",
        ambience: ambience,
        text: text,
        emotion: result.emotion
      })

      // Trigger a refresh for dashboard components
      setRefreshKey(prev => prev + 1)

    } catch (error) {
      console.error("Error analyzing and saving emotion:", error)
      // fallback in case of demo issues
      setAnalysisResult({
        emotion: "Calm",
        keywords: ["error", "fallback"],
        summary: "There was an issue reaching the server. Please ensure the backend is running."
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <JournalEntry onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            <EmotionAnalysis result={analysisResult} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <InsightsDashboard refreshKey={refreshKey} />
            <RecentEntries refreshKey={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  )
}
