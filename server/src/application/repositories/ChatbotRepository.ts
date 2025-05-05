import type { Question } from '../../domain/entities/question'

export interface ChatbotRepository {
  generateAnswer(prompt: string): Promise<string>
  generateQuiz(): Promise<{ questions: Question[]; title: string }>
}
