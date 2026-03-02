"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { MCQQuestion } from "@/lib/types"

interface QuestionCardProps {
  question: MCQQuestion
  index: number
  selectedAnswer: string | undefined
  onAnswerChange: (questionId: number, answer: string) => void
}

export function QuestionCard({
  question,
  index,
  selectedAnswer,
  onAnswerChange,
}: QuestionCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
          {index + 1}
        </span>
        <h3 className="text-base font-medium text-foreground leading-relaxed pt-1">
          {question.question}
        </h3>
      </div>

      <RadioGroup
        value={selectedAnswer}
        onValueChange={(value) => onAnswerChange(question.id, value)}
        className="flex flex-col gap-2 pl-11"
      >
        {question.options.map((option) => (
          <Label
            key={option.label}
            htmlFor={`q${question.id}-${option.label}`}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors",
              selectedAnswer === option.label
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30 hover:bg-accent",
            )}
          >
            <RadioGroupItem
              value={option.label}
              id={`q${question.id}-${option.label}`}
            />
            <span className="text-sm text-foreground">
              <span className="font-medium text-muted-foreground mr-1.5">
                {option.label}.
              </span>
              {option.text}
            </span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}
