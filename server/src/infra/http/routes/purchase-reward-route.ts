import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { GetFanByAuth } from '../../../application/usecases/get-fan-by-auth'
import { PurchaseReward } from '../../../application/usecases/purchase-reward'
import { Code } from '../../../domain/value-objects/Code'
import { DrizzleFanRepository } from '../../database/drizzle/repositories/drizzle-fan-repository'
import { DrizzleRewardRepository } from '../../database/drizzle/repositories/drizzle-reward-repository'
import { DrizzleTradeRepository } from '../../database/drizzle/repositories/drizzle-trade-repository'

export const purchaseRewardRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/purchase-reward',
    {
      schema: {
        summary: 'Create a reward',
        operationId: 'createReward',
        tags: ['reward'],
        body: z.object({
          fanAuthId: z.string(),
          rewardCode: z.string(),
        }),
        response: {
          202: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z
              .object({
                id: z.string().ulid(),
                fanId: z.string().ulid(),
                rewardCode: z.string(),
              })
              .array()
              .nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { fanAuthId, rewardCode } = request.body
      const fanRepository = new DrizzleFanRepository()
      const rewardRepository = new DrizzleRewardRepository()
      const tradeRepository = new DrizzleTradeRepository()

      const purchaseReward = new PurchaseReward(
        fanRepository,
        rewardRepository,
        tradeRepository
      )

      const code = Code.use(rewardCode)
      const getFanByAuth = new GetFanByAuth(fanRepository)

      try {
        const fan = await getFanByAuth.execute({ userId: fanAuthId })

        if (!fan.success) throw new Error('User not authenticated')

        const response = await purchaseReward.execute({
          fanId: fan.data[0].id,
          rewardCode: code,
        })

        const purchaseRewardData = response.data[0]

        const data: {
          id: string
          fanId: string
          rewardCode: string
        }[] = []

        if (response.data.length > 0) {
          data.push({
            id: purchaseRewardData.id,
            fanId: purchaseRewardData.props.fanId,
            rewardCode: purchaseRewardData.props.rewardId,
          })
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
