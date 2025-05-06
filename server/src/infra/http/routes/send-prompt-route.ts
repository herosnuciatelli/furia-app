import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { GroqChatbotRepository } from '../../ai/repositories/groq-chatbot-repository'
import { SendPrompt } from "../../../application/usecases/send-prompt";

export const sendPromptRoute: FastifyPluginAsyncZod = async app => {
    app.post(
        "/send-prompt", 
        {
            schema: {
                summary: 'Send prompt to chatbot answer',
                operationId: 'sendPrompt',
                tags: ['chatbot'],
                body: z.object({
                    prompt: z.string()
                }),
                response:{
                    202: z.object({
                        message: z.string(),
                        data: z.string().array(),
                        success: z.boolean()
                    })
                }
            }
        },
        async (request, reply) => {
            const { prompt } = request.body

            const chatbotRepository = new GroqChatbotRepository()
            
            const sendPrompt = new SendPrompt(chatbotRepository);

            try {
                const response = await sendPrompt.execute({ prompt })

                reply.code(202).send({
                    data: response.data,
                    message: response.message,
                    success: response.success,
                  })
            } catch (error) {
                console.error(error)

                return reply.status(400).send({
                  message: error.message,
                  data: [],
                  success: false,
                })
            }
        }
)
}