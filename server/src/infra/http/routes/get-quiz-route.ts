import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getQuizRoute: FastifyPluginAsyncZod = async app => {
	app.get(
		"/get-quiz/:quizId",
		{
			schema: {
				summary: "Create a quiz",
				operationId: "createQuiz",
				tags: ["quiz", "chatbot"],
                params: z.object({
                    quizId: z.string().ulid().min(1)
                }),
                response: z.object({

                })
			},
		},
		async (request, reply) => {},
	);
};
