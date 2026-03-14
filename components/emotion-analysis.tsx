"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Smile, Frown, Coffee, Heart } from "lucide-react"

export interface EmotionResult {
  emotion: "Calm" | "Happy" | "Sad" | "Stressed"
  keywords: string[]
  summary: string
}

interface EmotionAnalysisProps {
  result: EmotionResult | null
}

const emotionConfig = {
  Calm: {
    icon: Coffee,
    color: "bg-purple-500/20 text-purple-500",
    gradient: "from-purple-500/20 to-transparent",
  },
  Happy: {
    icon: Smile,
    color: "bg-green-500/20 text-green-500",
    gradient: "from-green-500/20 to-transparent",
  },
  Sad: {
    icon: Frown,
    color: "bg-blue-500/20 text-blue-500",
    gradient: "from-blue-500/20 to-transparent",
  },
  Stressed: {
    icon: Heart,
    color: "bg-red-500/20 text-red-500",
    gradient: "from-red-500/20 to-transparent",
  },
}

export function EmotionAnalysis({ result }: EmotionAnalysisProps) {
  if (!result) {
    return (
      <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl shadow-primary/5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            Emotion Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Write a journal entry and click &quot;Analyze Emotion&quot; to see your results here.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const config = emotionConfig[result.emotion]
  const EmotionIcon = config.icon

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl shadow-primary/5 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`} />
      <CardHeader className="pb-4 relative">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-primary" />
          Emotion Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${config.color}`}>
            <EmotionIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Detected Emotion</p>
            <p className="text-xl font-semibold text-foreground">{result.emotion}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Keywords</p>
          <div className="flex flex-wrap gap-2">
            {result.keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="bg-secondary/80 text-secondary-foreground">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">AI Summary</p>
          <p className="text-foreground/90 leading-relaxed">{result.summary}</p>
        </div>
      </CardContent>
    </Card>
  )
}
