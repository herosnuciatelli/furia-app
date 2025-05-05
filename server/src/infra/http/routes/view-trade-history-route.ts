import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ViewTradeHistory } from '../../../application/usecases/view-trade-history'
import { DrizzleTradeRepository } from '../../database/drizzle/repositories/drizzle-trade-repository'

export const viewTradeHistoryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/view-trade-history',
    {
      schema: {
        summary: 'View trade history',
        operationId: 'viewTradeHistory',
        tags: ['trade'],
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
                fanId: z.string().ulid(),
                rewardId: z.string().ulid(),
                transaction_date: z.date(),
              })
              .array()
              .nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { fanId, cursor } = request.query

      const tradeRepository = new DrizzleTradeRepository()

      const viewTradeHistory = new ViewTradeHistory(tradeRepository)

      try {
        const response = await viewTradeHistory.execute({
          fanId,
          cursor: { start: cursor ?? '' },
        })

        const data: {
          fanId: string
          id: string
          rewardId: string
          transaction_date: Date
        }[] = []

        if (response.data.length > 0) {
          for (const trade of response.data) {
            data.push({
              id: trade.id,
              fanId: trade.props.fanId,
              rewardId: trade.props.rewardId,
              transaction_date: trade.props.transaction_date,
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
