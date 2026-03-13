"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QuestionCard } from "@/components/question-card"
import type { MCQQuestion } from "@/lib/types"

interface QuizViewProps {
  questions: MCQQuestion[]
  answers: Record<number, string>
  onAnswerChange: (questionId: number, answer: string) => void
  onSubmit: () => void
  onReset: () => void
}

export function QuizView({
  questions,
  answers,
  onAnswerChange,
  onSubmit,
  onReset,
}: QuizViewProps) {
  const answeredCount = Object.keys(answers).length
  const totalCount = questions.length
  const allAnswered = answeredCount === totalCount
 
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="sticky top-0 bg-white rounded-md p-4 z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Your Quiz
          </h2>
          <span className="text-sm text-muted-foreground">
            {answeredCount} of {totalCount} answered
          </span>
        </div>
        <Progress value={(answeredCount / totalCount) * 100} />
      </div>

      <div className="flex flex-col gap-5">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            selectedAnswer={answers[question.id]}
            onAnswerChange={onAnswerChange}
            showExplanation={false}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <Button variant="outline" onClick={onReset}>
          Start Over
        </Button>
        <Button onClick={onSubmit} disabled={!allAnswered} size="lg" className="px-8">
          Submit Answers
        </Button>
      </div>
    </div>
  )
}
