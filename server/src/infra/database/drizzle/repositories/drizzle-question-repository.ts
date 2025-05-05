import { eq, inArray } from 'drizzle-orm'
import { db } from '..'
import type { QuestionRepository } from '../../../../application/repositories/QuestionRespository'
import { Question } from '../../../../domain/entities/question'
import { questions, questions as questionsSchema } from '../schema/schema'

type DrizzleQuestionType = {
  correctAnswer: 'a' | 'b' | 'c' | 'd'
  id: string
  options: { id: 'a' | 'b' | 'c' | 'd'; option: string }[]
  statement: string
  submittedAnswer: 'a' | 'b' | 'c' | 'd' | ''
}

export class DrizzleQuestionRepository implements QuestionRepository {
  async createMany(questions: Question[]): Promise<void> {
    const questionsToBeUpdated: DrizzleQuestionType[] = []
    for (const question of questions) {
      questionsToBeUpdated.push({
        correctAnswer: question.props.correctAnswer,
        id: question.id,
        options: question.props.options,
        statement: question.props.statement,
        submittedAnswer: question.props.submittedAnswer,
      })
    }

    await db.insert(questionsSchema).values(questionsToBeUpdated)
  }

  async findById(id: string): Promise<Question | null> {
    const question = await db.query.questions.findFirst({
      where: eq(questionsSchema.id, id),
    })

    if (!question) return null

    return Question.create(
      {
        correctAnswer: question.correctAnswer,
        options: question.options as {
          id: 'a' | 'b' | 'c' | 'd'
          option: string
        }[],
        statement: question.statement,
        submittedAnswer: question.submittedAnswer,
      },
      question.id
    )
  }

  async findMany(ids: string[]): Promise<Question[] | null> {
    const questionsQueryResult = await db.query.questions.findMany({
      where: inArray(questionsSchema.id, ids),
    })

    if (questionsQueryResult.length === 0) return null

    const questions: Question[] = []

    for (const question of questionsQueryResult) {
      questions.push(
        Question.create(
          {
            correctAnswer: question.correctAnswer,
            options: question.options as {
              id: 'a' | 'b' | 'c' | 'd'
              option: string
            }[],
            statement: question.statement,
            submittedAnswer: question.submittedAnswer,
          },
          question.id
        )
      )
    }

    return questions
  }

  async submitAnswer(id: string, answer: 'a' | 'b' | 'c' | 'd'): Promise<void> {
    await db
      .update(questions)
      .set({
        submittedAnswer: answer,
      })
      .where(eq(questions.id, id))
  }
}
