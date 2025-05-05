import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { CreateReward } from '../../../application/usecases/create-reward'
import { Reward } from '../../../domain/entities/reward'
import { Code } from '../../../domain/value-objects/Code'
import { FuryCoins } from '../../../domain/value-objects/FuryCoins'
import { Name } from '../../../domain/value-objects/Name'
import { Quantity } from '../../../domain/value-objects/Quantity'
import { DrizzleRewardRepository } from '../../database/drizzle/repositories/drizzle-reward-repository'

export const createRewardRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/create-reward',
    {
      schema: {
        summary: 'Create a reward',
        operationId: 'createReward',
        tags: ['reward'],
        body: z.object({
          code: z.string(),
          price: z.number(),
          quantity: z.number(),
          name: z.string(),
        }),
        response: {
          202: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z
              .object({
                code: z.string(),
                price: z.number(),
                quantity: z.number(),
                name: z.string(),
                id: z.string().ulid(),
              })
              .array(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code, name, price, quantity } = request.body
      const rewardRepository = new DrizzleRewardRepository()

      const createReward = new CreateReward(rewardRepository)

      const reward = Reward.create({
        code: Code.use(code),
        name: Name.use(name),
        price: FuryCoins.use(price),
        quantity: Quantity.use(quantity),
      })

      try {
        const response = await createReward.execute({
          reward,
        })

        const rewardData = response.data[0]

        const data: {
          code: string
          id: string
          price: number
          quantity: number
          name: string
        }[] = []

        if (response.data.length > 0) {
          data.push({
            code: rewardData.props.code.value,
            id: rewardData.id,
            name: rewardData.props.name.value,
            price: rewardData.props.price.value,
            quantity: rewardData.props.quantity.value,
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
