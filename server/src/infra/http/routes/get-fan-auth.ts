import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { GetFanByAuth } from '../../../application/usecases/get-fan-by-auth'
import { DrizzleFanRepository } from '../../database/drizzle/repositories/drizzle-fan-repository'

export const getFanAuthRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/get-fan-auth',
    {
      schema: {
        summary: 'Get the fan by auth id',
        operationId: 'getFan',
        tags: ['fan'],
        body: z.object({
          authId: z.string(),
        }),
        response: {
          202: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z
              .object({
                username: z.string(),
                points: z.number(),
                id: z.string().ulid(),
                furyCoins: z.number()
              })
              .array(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { authId } = request.body
      const fanRepository = new DrizzleFanRepository()

      const getFanByAuth = new GetFanByAuth(fanRepository)

      try {
        const {
          data: fanByAuthId,
          message,
          success,
        } = await getFanByAuth.execute({
          userId: authId,
        })

        if (fanByAuthId.length === 0) throw new Error('User not authenticated')

        const data: {
          username: string
          points: number
          id: string
          furyCoins: number
        }[] = []

        const fan = fanByAuthId[0]

        if (fanByAuthId.length > 0) {
          data.push({
            id: fan.id,
            points: fan.props.points.value,
            username: fan.props.username.value,
            furyCoins: fan.props.furyCoins.value
          })
        }

        reply.code(202).send({
          data,
          message,
          success,
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
