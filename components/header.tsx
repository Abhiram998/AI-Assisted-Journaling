"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Brain } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20 text-primary">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">MindJournal AI</h1>
            <p className="text-sm text-muted-foreground">Reflect, Analyze, Improve</p>
          </div>
        </div>
        <Avatar className="h-10 w-10 ring-2 ring-primary/30">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="User" />
          <AvatarFallback className="bg-primary/20 text-primary">JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
