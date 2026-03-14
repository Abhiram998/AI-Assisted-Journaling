"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChart, TreesIcon } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Cell, Pie, PieChart as RechartsPie } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getJournalInsightsAPI, InsightsResponse } from "@/services/api"

interface InsightsDashboardProps {
  refreshKey?: number
}

const chartConfig = {
  mood: {
    label: "Mood",
    color: "var(--color-chart-1)",
  },
  calm: {
    label: "Calm",
    color: "var(--color-chart-1)",
  },
  happy: {
    label: "Happy",
    color: "var(--color-chart-2)",
  },
  stressed: {
    label: "Stressed",
    color: "var(--color-chart-3)",
  },
  sad: {
    label: "Sad",
    color: "var(--color-chart-4)",
  },
}

export function InsightsDashboard({ refreshKey = 0 }: InsightsDashboardProps) {
  const [data, setData] = useState<InsightsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchInsights = async () => {
      try {
        setLoading(true)
        const insightsData = await getJournalInsightsAPI("demo-user")
        if (mounted) {
          setData(insightsData)
        }
      } catch (error) {
        console.error("Failed to fetch insights", error)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchInsights()
    return () => { mounted = false }
  }, [refreshKey])

  if (loading || !data) {
    return (
      <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl shadow-primary/5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Insights Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex justify-center items-center">
          <span className="text-muted-foreground text-sm">Loading insights...</span>
        </CardContent>
      </Card>
    )
  }

  // Display empty state if no entries
  if (data.totalEntries === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl shadow-primary/5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Insights Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex justify-center items-center">
          <span className="text-muted-foreground text-sm">No entries yet. Analytics will appear here.</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl shadow-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          Insights Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Over Time Chart */}
        {data.moodData.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Mood Over Time</h4>
            <ChartContainer config={chartConfig} className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.moodData}>
                  <XAxis
                    dataKey="day"
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 10]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-chart-1)", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: "var(--color-chart-1)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}

        {/* Emotion Distribution */}
        {data.emotionDistribution.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Emotion Distribution
            </h4>
            <div className="flex items-center gap-4">
              <ChartContainer config={chartConfig} className="h-[120px] w-[120px]">
                <RechartsPie>
                  <Pie
                    data={data.emotionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.emotionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsPie>
              </ChartContainer>
              <div className="flex-1 space-y-2">
                {data.emotionDistribution.map((emotion) => (
                  <div key={emotion.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: emotion.fill }}
                      />
                      <span className="text-foreground">{emotion.name}</span>
                    </div>
                    <span className="text-muted-foreground">{emotion.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top Ambiences */}
        {data.topAmbiences.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Top Ambiences Used</h4>
            <div className="space-y-2">
              {data.topAmbiences.map((ambience) => (
                <div key={ambience.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <TreesIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{ambience.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{ambience.count} entries</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
