"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TreesIcon, Waves, Mountain, CloudRain } from "lucide-react"

interface JournalEntryProps {
  onAnalyze: (text: string, ambience: string) => void
  isAnalyzing: boolean
}

export function JournalEntry({ onAnalyze, isAnalyzing }: JournalEntryProps) {
  const [text, setText] = useState("")
  const [ambience, setAmbience] = useState("forest")

  const handleAnalyze = () => {
    if (text.trim()) {
      onAnalyze(text, ambience)
    }
  }

  const ambienceIcons = {
    forest: TreesIcon,
    ocean: Waves,
    mountain: Mountain,
    rain: CloudRain,
  }

  const AmbienceIcon = ambienceIcons[ambience as keyof typeof ambienceIcons] || TreesIcon

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl shadow-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          New Journal Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="How are you feeling today? Write your thoughts here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[180px] bg-background/50 border-border/50 resize-none text-foreground placeholder:text-muted-foreground focus:ring-primary/50"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={ambience} onValueChange={setAmbience}>
            <SelectTrigger className="w-full sm:w-[200px] bg-background/50 border-border/50">
              <div className="flex items-center gap-2">
                <AmbienceIcon className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Select ambience" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card border-border/50">
              <SelectItem value="forest">
                <div className="flex items-center gap-2">
                  <TreesIcon className="h-4 w-4" />
                  Forest
                </div>
              </SelectItem>
              <SelectItem value="ocean">
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4" />
                  Ocean
                </div>
              </SelectItem>
              <SelectItem value="mountain">
                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4" />
                  Mountain
                </div>
              </SelectItem>
              <SelectItem value="rain">
                <div className="flex items-center gap-2">
                  <CloudRain className="h-4 w-4" />
                  Rain
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleAnalyze}
            disabled={!text.trim() || isAnalyzing}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isAnalyzing ? "Analyzing emotion..." : "Analyze Emotion"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
