export type MCQOption = { A: string } | { B: string } | { C: string } | { D: string }

export interface MCQQuestion {
  id: number
  question: string
  options: MCQOption[]
  correct_answer: string
  explanation?: string
}

export interface QuizState {
  answers: Record<number, string>
}
