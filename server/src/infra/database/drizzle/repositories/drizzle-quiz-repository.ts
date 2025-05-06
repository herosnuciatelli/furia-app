import { eq, gt } from 'drizzle-orm'
import { db } from '..'
import type { QuizRepository } from '../../../../application/repositories/QuizRepository'
import { Quiz } from '../../../../domain/entities/quiz'
import { quizzes } from '../schema/schema'

export class DrizzleQuizRepository implements QuizRepository {
  async create(quiz: Quiz): Promise<Quiz> {
    await db.insert(quizzes).values({
      fanId: quiz.props.fanId,
      id: quiz.id,
      questionsIdentifiers: quiz.props.questionsIdentifiers,
      score: quiz.props.score,
      title: quiz.props.title,
      created_at: quiz.props.created_at
    })

    return quiz
  }

  async findById(id: string): Promise<Quiz | null> {
    const quiz = await db.query.quizzes.findFirst({
      where: eq(quizzes.id, id),
    })

    if (!quiz) return null

    return Quiz.create(
      {
        created_at: new Date(quiz.created_at),
        fanId: quiz.fanId,
        questionsIdentifiers: quiz.questionsIdentifiers,
        score: quiz.score,
        title: quiz.title,
      },
      quiz.id
    )
  }

  async history(
    fanId: string,
    cursor?: { start: string }
  ): Promise<Quiz[] | null> {
    const quizzesQueryResult = await db.query.quizzes.findMany({
      where: cursor ? gt(quizzes.id, cursor.start) : eq(quizzes.fanId, fanId),
      limit: 10,
      orderBy: (quizzes, { desc }) => [desc(quizzes.id)],
    })

    if (quizzesQueryResult.length === 0) return null

    const quizHistory: Quiz[] = []

    for (const quiz of quizzesQueryResult) {
      quizHistory.push(
        Quiz.create(
          {
            created_at: new Date(quiz.created_at),
            fanId: quiz.fanId,
            questionsIdentifiers: quiz.questionsIdentifiers,
            score: quiz.score,
            title: quiz.title,
          },
          quiz.id
        )
      )
    }

    return quizHistory
  }

  async updateScore(id: string, score: number): Promise<void> {
    await db
      .update(quizzes)
      .set({
        score: score,
      })
      .where(eq(quizzes.id, id))
  }
}
