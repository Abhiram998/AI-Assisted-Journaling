"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Smile, Frown, Coffee, Heart } from "lucide-react"
import { getJournalEntriesAPI, JournalEntryResponse } from "@/services/api"

interface RecentEntriesProps {
  refreshKey?: number
}

const emotionConfig: Record<string, any> = {
  Calm: {
    icon: Coffee,
    variant: "secondary" as const,
    className: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  },
  Happy: {
    icon: Smile,
    variant: "secondary" as const,
    className: "bg-green-500/20 text-green-500 border-green-500/30",
  },
  Sad: {
    icon: Frown,
    variant: "secondary" as const,
    className: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  },
  Stressed: {
    icon: Heart,
    variant: "secondary" as const,
    className: "bg-red-500/20 text-red-500 border-red-500/30",
  },
}

export function RecentEntries({ refreshKey = 0 }: RecentEntriesProps) {
  const [entries, setEntries] = useState<JournalEntryResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchEntries = async () => {
      try {
        setLoading(true)
        const data = await getJournalEntriesAPI("demo-user")
        if (mounted) {
          setEntries(data)
        }
      } catch (error) {
        console.error("Failed to fetch entries", error)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchEntries()
    return () => { mounted = false }
  }, [refreshKey])

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl shadow-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Recent Entries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-4">
          {loading ? (
            <div className="flex justify-center items-center h-full text-muted-foreground text-sm">
              Loading entries...
            </div>
          ) : entries.length === 0 ? (
            <div className="flex justify-center items-center h-full text-muted-foreground text-sm">
              Start your first journal entry
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => {
                const config = emotionConfig[entry.emotion] || emotionConfig.Calm
                const EmotionIcon = config.icon

                return (
                  <div
                    key={entry.id}
                    className="p-3 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-xs text-muted-foreground">{entry.date}</span>
                      <Badge variant={config.variant} className={`text-xs ${config.className}`}>
                        <EmotionIcon className="h-3 w-3 mr-1" />
                        {entry.emotion}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
                      {entry.preview}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
