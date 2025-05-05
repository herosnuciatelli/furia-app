import type { Quiz } from '../../domain/entities/quiz'

export interface QuizRepository {
  create(quiz: Quiz): Promise<Quiz>
  findById(id: string): Promise<Quiz | null>
  updateScore(id: string, score: number): Promise<void>
  history(fanId: string, cursor?: { start: string }): Promise<Quiz[] | null>
}
