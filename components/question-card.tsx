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
  showExplanation?: boolean
}

export function QuestionCard({
  question,
  index,
  selectedAnswer,
  onAnswerChange,
  showExplanation = true,
}: QuestionCardProps) {
  // The payload options are an array of strings, not objects
  // correct_answer is a letter (A, B, C, D)
  const optionLabels = ["A", "B", "C", "D"];
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
        {question.options.map((option, i) => {
          const label = optionLabels[i];
          return (
            <Label
              key={label}
              htmlFor={`q${question.id}-${label}`}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors",
                selectedAnswer === label
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30 hover:bg-accent",
              )}
            >
              <RadioGroupItem
                value={label}
                id={`q${question.id}-${label}`}
              />
              <span className="text-sm text-foreground">
                <span className="font-medium text-muted-foreground mr-1.5">
                  {label}.
                </span>
                {(option as Record<string, string>)[label]}
              </span>
            </Label>
          );
        })}
      </RadioGroup>
      {showExplanation && selectedAnswer && (
        <div className="mt-4 pl-11">
          <div
            className={cn(
              "text-sm rounded-lg px-4 py-3",
              selectedAnswer === question.correct_answer
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {selectedAnswer === question.correct_answer ? "Correct!" : "Incorrect."}
            {question.explanation && (
              <span className="block mt-1 text-foreground">{question.explanation}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
