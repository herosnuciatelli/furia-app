import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { DrizzleQuizRepository } from '../../database/drizzle/repositories/drizzle-quiz-repository'
import { ViewQuizHistory } from '../../../application/usecases/view-quiz-history'

export const viewQuizHistoryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/view-quiz-history',
    {
      schema: {
        summary: 'View quiz history',
        operationId: 'viewQuizHistory',
        tags: ['quiz'],
        querystring: z.object({
          fanId: z.string().ulid(),
          cursor: z.string().optional(),
        }),
        response: {
          202: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z
              .object({
                id: z.string().ulid(),
                score: z.number(),
                created_at: z.date(),
              })
              .array()
              .nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { fanId, cursor } = request.query

      const quizRepository = new DrizzleQuizRepository()

      const viewQuizHistory = new ViewQuizHistory(quizRepository)

      try {
        const response = await viewQuizHistory.execute({
          fanId,
          cursor: { start: cursor ?? '' },
        })

        const data: {
            id: string
            title: string
            score: number
            created_at: Date
          }[] = []

        if (response.data.length > 0) {
          for (const quiz of response.data) {
            data.push({
              id: quiz.id,
              created_at: quiz.props.created_at,
              score: quiz.props.score,
              title: quiz.props.title
            })
          }
        }

        reply.code(202).send({
          data,
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
