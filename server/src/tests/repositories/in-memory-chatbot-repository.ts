import type { ChatbotRepository } from '../../application/repositories/ChatbotRepository'
import type { Question } from '../../domain/entities/question'

export class InMemoryChatbotRepository implements ChatbotRepository {
  public answer: string
  public quiz: { questions: Question[]; title: string } = {
    questions: [],
    title: '',
  }

  async generateAnswer(prompt: string): Promise<string> {
    return this.answer
  }

  async generateQuiz(): Promise<{ questions: Question[]; title: string }> {
    return this.quiz
  }
}
