import type { QuizRepository } from '../../application/repositories/QuizRepository'
import type { Quiz } from '../../domain/entities/quiz'

import { decodeTime } from 'ulid'

export class InMemoryQuizRepository implements QuizRepository {
  private items: Quiz[] = []

  async findById(id: string): Promise<Quiz | null> {
    const quiz = this.items.find(quiz => quiz.id === id)

    if (!quiz) {
      return null
    }

    return quiz
  }

  async create(quiz: Quiz): Promise<Quiz> {
    this.items.push(quiz)
    return quiz
  }

  async updateScore(id: string, score: number): Promise<void> {
    const quiz = await this.findById(id)

    if (quiz) {
      quiz.props.score = score
    }
  }

  async history(
    fanId: string,
    cursor?: { start: string }
  ): Promise<Quiz[] | null> {
    let history = this.items.filter(item => item.props.fanId === fanId)

    if (history.length === 0) {
      return null
    }

    if (!cursor) {
      history = history.slice(0, 10)
      return history
    }
    /**
     * @param end The query limit is 10 quizzes at time.
     */
    const cursorStart = decodeTime(cursor.start)

    history.filter(quiz => {
      const quizDate = decodeTime(quiz.id)
      if (quizDate > cursorStart) return quiz
    })

    history = history.slice(0, 10)

    return history
  }
}
