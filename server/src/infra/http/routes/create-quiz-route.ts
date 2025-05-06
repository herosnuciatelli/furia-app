import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { CreateQuiz } from '../../../application/usecases/create-quiz'
import { GroqChatbotRepository } from '../../ai/repositories/groq-chatbot-repository'
import { DrizzleQuestionRepository } from '../../database/drizzle/repositories/drizzle-question-repository'
import { DrizzleQuizRepository } from '../../database/drizzle/repositories/drizzle-quiz-repository'

export const createQuizRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/create-quiz/:fanId',
    {
      schema: {
        summary: 'Create a quiz',
        operationId: 'createQuiz',
        tags: ['quiz', 'chatbot'],
        params: z.object({
          fanId: z.string(),
        }),
        response: {
          202: z.object({
            success: z.boolean(),
            message: z.string(),
            data: z
              .object({
                title: z.string(),
                questionsIdentifiers: z.string().ulid().array(),
                fanId: z.string().ulid(),
                score: z.number(),
                created_at: z.date(),
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

      const { fanId } = request.params

      const createQuiz = new CreateQuiz(
        questionRepository,
        quizRepository,
        chatbotRepository
      )

      try {
        const response = await createQuiz.execute({ fanId })

        const quiz = response.data[0]

        const data: {
          title: string
          questionsIdentifiers: string[]
          fanId: string
          score: number
          created_at: Date
          id: string
        }[] = []

        if (response.data.length > 0) {
          data.push({
            title: quiz.props.title,
            created_at: quiz.props.created_at,
            fanId: quiz.props.fanId,
            id: quiz.id,
            questionsIdentifiers: quiz.props.questionsIdentifiers,
            score: quiz.props.score,
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
