import type { Question } from '../../domain/entities/question'

export interface QuestionRepository {
  findById(id: string): Promise<Question | null>
  findMany(ids: string[]): Promise<Question[] | null>
  createMany(questions: Question[]): Promise<void>
  submitAnswer(id: string, answer: 'a' | 'b' | 'c' | 'd'): Promise<void>
}
