"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

async function handleGenerate() {
  if (!query) return
  setLoading(true)

  const res = await fetch("/api/generate", {
    method: "POST",
    body: JSON.stringify({ query }),
  })

  const data = await res.json()

  setResults(data.startingPoints)
  setLoading(false)
}

  return (
    <main className="max-w-3xl mx-auto py-20 px-4 space-y-8">
      <h1 className="text-4xl font-bold text-center">
        Comic Reading Order Generator
      </h1>

      <div className="flex gap-2">
        <Input
          placeholder="Enter a character (e.g. Batman)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleGenerate}>
          Generate
        </Button>
      </div>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      )}

      {!loading && results.map((item, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              {item.reason}
            </p>
            <ul className="list-disc pl-6 space-y-1">
              {item.issues.map((issue: string, idx: number) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </main>
  )
}