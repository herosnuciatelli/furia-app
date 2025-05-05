import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ViewGlobalRanking } from '../../../application/usecases/view-global-ranking'
import { DrizzleFanRepository } from '../../database/drizzle/repositories/drizzle-fan-repository'

export const viewGlobalRankingRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/view-global-ranking',
    {
      schema: {
        summary: 'View the global ranking',
        operationId: 'viewGlobalRanking',
        tags: ['fan'],
        response: {
          202: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z
              .object({
                username: z.string(),
                points: z.number(),
                id: z.string().ulid(),
              })
              .array(),
          }),
        },
      },
    },
    async (request, reply) => {
      const fanRepository = new DrizzleFanRepository()

      const viewGlobalRanking = new ViewGlobalRanking(fanRepository)

      try {
        const response = await viewGlobalRanking.execute()

        const data: {
          username: string
          points: number
          id: string
        }[] = []

        if (response.data.length > 0) {
          for (const fan of response.data[0]) {
            data.push({
              id: fan.id,
              points: fan.props.points.value,
              username: fan.props.username.value,
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
