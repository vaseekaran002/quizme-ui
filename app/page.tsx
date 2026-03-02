"use client"

import { useState, useCallback, useEffect } from "react"
import { FileUpload } from "@/components/file-upload"
import { QuizView } from "@/components/quiz-view"
import { ResultsView } from "@/components/results-view"
import type { MCQQuestion } from "@/lib/types"
import { BookOpen } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:579530"

type AppView = "upload" | "quiz" | "results"

export default function Home() {
  const [view, setView] = useState<AppView>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isFileUploaded, setIsFileUploaded] = useState(false)

  useEffect(() => {
    // if file is uploaded, call api to upload file 
      if (file) {
        const uploadFile = async () => {
          const formData = new FormData()
          formData.append("file", file)

          try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
              method: "POST",
              body: formData,
            })

            if (!response.ok) {
              throw new Error(`Failed to upload file (${response.status})`)
            }

            console.log("File uploaded successfully")
            setIsFileUploaded(true)
          } catch (err) {
            console.error("Error uploading file:", err)
          }
        }

        uploadFile()
      }
  }, [file])

  const handleGenerate = useCallback(async () => {
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const reqBody = {
      "num_questions": 10,
      "batch_size": 5
    }

      const response = await fetch(`${API_BASE_URL}/questions/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate questions (${response.status})`)
      }

      const data = await response.json()

      // Normalize response - support both { questions: [...] } and direct array
      const rawQuestions: MCQQuestion[] = Array.isArray(data) ? data : data.questions

      if (!rawQuestions || rawQuestions.length === 0) {
        throw new Error("No questions were generated. Try a different PDF.")
      }

      // Ensure each question has an id
      const normalized = rawQuestions.map((q, i) => ({
        ...q,
        id: q.id ?? i + 1,
      }))

      setQuestions(normalized)
      setAnswers({})
      setView("quiz")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [file])

  const handleAnswerChange = useCallback((questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }, [])

  const handleSubmit = useCallback(() => {
    setView("results")
  }, [])

  const handleReset = useCallback(() => {
    setFile(null)
    setQuestions([])
    setAnswers({})
    setError(null)
    setView("upload")
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-3xl flex items-center gap-2.5 px-6 py-4">
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
            <BookOpen className="size-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">QuizForge</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        {view === "upload" && (
          <div className="flex flex-col items-center">
            <FileUpload
              file={file}
              onFileChange={setFile}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              isFileUploaded={isFileUploaded}
            />
            {error && (
              <div className="mt-6 w-full max-w-lg rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
        )}

        {view === "quiz" && (
          <QuizView
            questions={questions}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        )}

        {view === "results" && (
          <ResultsView
            questions={questions}
            answers={answers}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  )
}
