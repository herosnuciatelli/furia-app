import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ViewProfile } from '../../../application/usecases/view-profile'
import { DrizzleFanRepository } from '../../database/drizzle/repositories/drizzle-fan-repository'
import { answerUserMessage } from '../functions/answer-user'

export const viewProfileRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/view-profile/:fanId',
    {
      schema: {
        summary: 'View a profile',
        operationId: 'viewProfile',
        tags: ['fan'],
        params: z.object({
          fanId: z.string().ulid(),
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
              })
              .array(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { fanId } = request.params
      const fanRepository = new DrizzleFanRepository()

      const viewProfile = new ViewProfile(fanRepository)

      try {
        const response = await viewProfile.execute({
          fanId,
        })

        const fan = response.data[0]

        const data: {
          username: string
          points: number
          id: string
        }[] = []

        if (response.data.length > 0) {
          data.push({
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
