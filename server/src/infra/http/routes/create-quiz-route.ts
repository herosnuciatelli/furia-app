import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { CreateQuiz } from '../../../application/usecases/create-quiz'
import { GroqChatbotRepository } from '../../ai/repositories/groq-chatbot-repository'
import { DrizzleQuestionRepository } from '../../database/drizzle/repositories/drizzle-question-repository'
import { DrizzleQuizRepository } from '../../database/drizzle/repositories/drizzle-quiz-repository'

export const createQuizRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/create-quiz',
    {
      schema: {
        summary: 'Create a quiz',
        operationId: 'createQuiz',
        tags: ['quiz', 'chatbot'],
        body: z.object({
          fanId: z.string(),
        }),
        response: {
          202: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z
              .object({
                id: z.string().ulid(),
              })
              .array(),
          }),
        },
      },
    },
    async (request, reply) => {
      const chatbotRepository = new GroqChatbotRepository()
      const quizRepository = new DrizzleQuizRepository()
      const questionRepository = new DrizzleQuestionRepository()

      const { fanId } = request.body

      const createQuiz = new CreateQuiz(
        questionRepository,
        quizRepository,
        chatbotRepository
      )

      try {
        const response = await createQuiz.execute({ fanId })

        const quiz = response.data[0]

        const data: {
          id: string
        }[] = []

        if (response.data.length > 0) {
          data.push({
            id: quiz.id
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
