"use client"

import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MCQQuestion } from "@/lib/types"

interface ResultsViewProps {
  questions: MCQQuestion[]
  answers: Record<number, string>
  onReset: () => void
}

export function ResultsView({ questions, answers, onReset }: ResultsViewProps) {
  const results = questions.map((q) => ({
    ...q,
    userAnswer: answers[q.id],
    isCorrect: answers[q.id] === q.correct_answer,
  }))

  console.log("Results:", results, questions, answers)
  const correctCount = results.filter((r) => r.isCorrect).length
  const score = Math.round((correctCount / questions.length) * 100)

  const getScoreColor = () => {
    if (score >= 80) return "text-success"
    if (score >= 50) return "text-chart-4"
    return "text-destructive"
  }

  const getScoreMessage = () => {
    if (score >= 80) return "Excellent work!"
    if (score >= 50) return "Good effort, keep studying!"
    return "Keep practicing, you will improve!"
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      {/* Score Card */}
      <div className="rounded-xl border bg-card p-8 text-center flex flex-col items-center gap-4">
        <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10">
          <Trophy className="size-8 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-foreground">Quiz Complete</h2>
          <p className="text-muted-foreground text-sm">{getScoreMessage()}</p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-5xl font-bold", getScoreColor())}>{score}%</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {correctCount} out of {questions.length} correct
        </p>
      </div>

      {/* Question Review */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-foreground">Review Answers</h3>

        <div className="flex flex-col gap-4">
          {results.map((result, index) => {
            const optionLabels = ["A", "B", "C", "D"];
            const userIndex = optionLabels.indexOf(result.userAnswer);
            const correctIndex = optionLabels.indexOf(result.correct_answer);
            const userOption = userIndex !== -1 ? result.options[userIndex] : undefined;
            const correctOption = correctIndex !== -1 ? result.options[correctIndex] : undefined;
            return (
              <div
                key={result.id}
                className={cn(
                  "rounded-xl border p-5 flex flex-col gap-3",
                  result.isCorrect ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5",
                )}
              >
                <div className="flex items-start gap-3">
                  {result.isCorrect ? (
                    <CheckCircle2 className="size-5 text-success mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="size-5 text-destructive mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      <span className="text-muted-foreground mr-1">{index + 1}.</span>
                      {result.question}
                    </p>

                    {!result.isCorrect && (
                      <div className="flex flex-col gap-1 text-sm">
                        <p className="text-destructive">
                          <span className="font-medium">Your answer:</span>{" "}
                          {userOption !== undefined
                            ? `${optionLabels[userIndex]}. ${(userOption as Record<string, string>)[optionLabels[userIndex] ]}`
                            : "No answer"}
                        </p>
                        <p className="text-success">
                          <span className="font-medium">Correct answer:</span>{" "}
                          {correctOption !== undefined
                            ? `${optionLabels[correctIndex]}. ${(correctOption as Record<string, string>)[optionLabels[correctIndex] ]}`
                            : result.correct_answer}
                        </p>
                      </div>
                    )}

                    {result.isCorrect && correctOption !== undefined && (
                      <p className="text-sm text-success">
                        <span className="font-medium">Answer:</span>{" "}
                        {optionLabels[correctIndex]}.  {(correctOption as Record<string, string>)[optionLabels[correctIndex] ]}
                      </p>
                    )}

                    {result.explanation && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {result.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center border-t pt-6">
        <Button onClick={onReset} size="lg" className="gap-2 px-8">
          <RotateCcw className="size-4" />
          Try Another PDF
        </Button>
      </div>
    </div>
  )
}
