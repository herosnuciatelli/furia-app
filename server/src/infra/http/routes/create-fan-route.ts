import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { CreateFan } from '../../../application/usecases/create-fan'
import { Email } from '../../../domain/value-objects/Email'
import { Username } from '../../../domain/value-objects/Username'
import { DrizzleFanRepository } from '../../database/drizzle/repositories/drizzle-fan-repository'

export const createFanRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/create-fan',
    {
      schema: {
        summary: 'Create a fan',
        operationId: 'createFan',
        tags: ['fan'],
        body: z.object({
          email: z.string().email().min(1),
          userId: z.string().uuid(),
          username: z.string(),
        }),
        response: {
          202: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z
              .object({
                username: z.string(),
                email: z.string().email(),
                points: z.number(),
                furyCoins: z.number(),
                id: z.string().ulid(),
              })
              .array(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, userId, username } = request.body
      const fanRepository = new DrizzleFanRepository()

      const createFan = new CreateFan(fanRepository)

      try {
        const response = await createFan.execute({
          email: Email.use(email),
          userId,
          username: Username.use(username),
        })

        const fan = response.data[0]

        const data: {
          email: string
          username: string
          points: number
          furyCoins: number
          id: string
        }[] = []

        if (response.data.length > 0) {
          data.push({
            email: fan.props.email.value,
            furyCoins: fan.props.furyCoins.value,
            id: fan.id,
            points: fan.props.points.value,
            username: fan.props.username.value,
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
