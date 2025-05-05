import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { TakeQuiz } from '../../../application/usecases/take-quiz'
import { DrizzleFanRepository } from '../../database/drizzle/repositories/drizzle-fan-repository'
import { DrizzleQuestionRepository } from '../../database/drizzle/repositories/drizzle-question-repository'
import { DrizzleQuizRepository } from '../../database/drizzle/repositories/drizzle-quiz-repository'

export const takeQuizRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/take-quiz',
    {
      schema: {
        summary: 'Take a quiz',
        operationId: 'takeQuiz',
        tags: ['quiz'],
        body: z.object({
          quizId: z.string(),
          answers: z
            .object({
              chosenOption: z.enum(['a', 'b', 'c', 'd']),
              questionId: z.string(),
            })
            .array(),
        }),
        response: {
          202: z.object({}),
        },
      },
    },
    async (request, reply) => {
      const fanRepository = new DrizzleFanRepository()
      const quizRepository = new DrizzleQuizRepository()
      const questionRepository = new DrizzleQuestionRepository()

      const { answers, quizId } = request.body

      const takeQuiz = new TakeQuiz(
        fanRepository,
        quizRepository,
        questionRepository
      )

      try {
        const response = await takeQuiz.execute({ answers, quizId })

        reply.code(202).send({
          data: [],
          message: response.message,
          success: response.success,
        })
      } catch (err) {
        console.error(err)

        return reply.status(400).send({
          message: err.message,
          data: [],
          success: false,
        })
      }
    }
  )
}
